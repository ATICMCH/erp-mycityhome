import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import FichajeOficinaBLL from "@/api/business/FichajeOficinaBLL";

// Función auxiliar para inyectar CORS en cada petición
const setCorsHeaders = (res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Token, idlogin');
};

const handler = nc({
    onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
        setCorsHeaders(res);
        console.error("🔥 Error Fichaje API:", err);
        res.status(500).json({ error: err?.message || "Internal Server Error" });
    },
    onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
        setCorsHeaders(res);
        res.status(404).end("Page is not found");
    }
})
.options((req: NextApiRequest, res: NextApiResponse) => {
    setCorsHeaders(res);
    res.status(200).end();
})
.use((req: NextApiRequest, res: NextApiResponse, next: any) => {
    setCorsHeaders(res);
    next();
})
.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const el = new (FichajeOficinaBLL as any)();
    const result = await el.list();
    res.status(200).json({ data: result });
})
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { idusuario, usuario, fecha, entrada, tipo_ejecucion, observacion, jornada, horario } = req.body;
        
        // 1. Instanciamos el BLL y sacamos el DAL para usar consultas SQL crudas 
        // (esto asegura que enviemos los campos exactos sin que nada los borre)
        const el = new (FichajeOficinaBLL as any)();
        const dal = (el as any).dataAcces;

        // 2. COMPROBACIÓN DE DUPLICADOS: Evita múltiples fichajes el mismo día
        const sqlCheck = `SELECT id FROM tbl_fichaje_oficina WHERE idusuario = $1 AND fecha = $2`;
        const check = await dal.execQueryPool(sqlCheck, [idusuario, fecha]);
        
        // Manejamos la respuesta de forma segura dependiendo de si tu BD devuelve un array directo o un objeto con "rows"
        const checkRows = Array.isArray(check) ? check : (check?.rows || []);

        if (checkRows.length > 0) {
            // Si ya hay un registro, detenemos todo con elegancia y devolvemos 409
            return res.status(409).json({ error: "El usuario ya ha registrado una entrada hoy." });
        }

        // 3. INSERCIÓN: Si no existe, creamos el registro
        const sqlInsert = `
            INSERT INTO tbl_fichaje_oficina 
            (idusuario, usuario, fecha, entrada, estado, tipo_ejecucion, observacion, jornada, horario, idusuario_ultimo_cambio)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id
        `;
        
        await dal.execQueryPool(sqlInsert, [
            idusuario, 
            usuario, 
            fecha, 
            entrada, 
            1, 
            tipo_ejecucion || 'manual', 
            observacion || 'Fichaje desde botón', 
            jornada, 
            horario, 
            idusuario // Obligatorio para que PostgreSQL no lance el error de NULL
        ]);

        console.log(`✅ Entrada grabada con éxito para: ${usuario}`);
        res.status(200).json({ data: "Entrada registrada" });

    } catch (error: any) {
        console.error("Error en POST Fichaje:", error?.message);
        res.status(500).json({ error: error?.message || 'Error al guardar en BD' });
    }
})
.put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { idusuario } = req.body;
        const ahora = new Date();
        const hoy = ahora.toLocaleDateString('sv-SE'); 
        const horaSalida = ahora.toLocaleTimeString('es-ES', { hour12: false });
        const timestampSalida = `${hoy} ${horaSalida}`;

        const el = new (FichajeOficinaBLL as any)();
        const dal = (el as any).dataAcces;

        // 1. Verificamos si existe el registro de hoy y NO tiene salida aún
        const sqlCheck = `SELECT id FROM tbl_fichaje_oficina WHERE idusuario = $1 AND fecha = $2 AND salida IS NULL`;
        const check = await dal.execQueryPool(sqlCheck, [idusuario, hoy]);
        
        const checkRows = Array.isArray(check) ? check : (check?.rows || []);

        if (checkRows.length === 0) {
            return res.status(400).json({ error: "No tienes una entrada abierta hoy o ya registraste tu salida." });
        }

        // 2. Actualizamos la salida
        const sqlUpdate = `
            UPDATE tbl_fichaje_oficina 
            SET salida = $1, idusuario_ultimo_cambio = $2 
            WHERE idusuario = $3 AND fecha = $4 AND salida IS NULL`;
        
        await dal.execQueryPool(sqlUpdate, [timestampSalida, idusuario, idusuario, hoy]);
        
        console.log(`✅ Salida grabada para usuario ${idusuario} a las ${horaSalida}`);
        res.status(200).json({ data: "Salida registrada con éxito" });
    } catch (err: any) {
        console.error("Error en PUT Fichaje:", err?.message);
        res.status(500).json({ error: err?.message || 'Error al actualizar salida' });
    }
});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};

export default handler;
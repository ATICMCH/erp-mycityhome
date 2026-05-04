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
    // Usamos SQL directo para evitar el error de list is not a function
    const el = new (FichajeOficinaBLL as any)();
    const dal = (el as any).dataAcces;
    const result = await dal.execQueryPool('SELECT * FROM tbl_fichaje_oficina ORDER BY id DESC');
    res.status(200).json({ data: Array.isArray(result) ? result : (result?.rows || []) });
})
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const el = new (FichajeOficinaBLL as any)();
        const dal = (el as any).dataAcces;
        const item = req.body; 
        item.estado = 1;
        
        // 1. VALIDACIÓN ANTI-DUPLICADOS (Una sola entrada al día)
        const sqlCheck = `SELECT id FROM tbl_fichaje_oficina WHERE idusuario = $1 AND fecha = $2`;
        const check = await dal.execQueryPool(sqlCheck, [item.idusuario, item.fecha]);
        const checkRows = Array.isArray(check) ? check : (check?.rows || []);

        if (checkRows.length > 0) {
            // Si ya fichó, bloqueamos la inserción y mandamos la advertencia al Chrome
            console.log(`⚠️ Intento duplicado bloqueado para: ${item.usuario}`);
            return res.status(409).json({ error: "El usuario ya ha registrado una entrada hoy." });
        }

        // 2. INSERCIÓN ORIGINAL
        const result = await el.insert(item);
        
        console.log(`✅ Entrada grabada con éxito para: ${item.usuario}`);
        res.status(200).json({ data: result });

    } catch (error: any) {
        console.error("Error en POST Fichaje:", error?.message || error);
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
        
        // 1. VALIDACIÓN PARA SALIDA
        const sqlCheck = `SELECT id FROM tbl_fichaje_oficina WHERE idusuario = $1 AND fecha = $2 AND salida IS NULL`;
        const check = await dal.execQueryPool(sqlCheck, [idusuario, hoy]);
        const checkRows = Array.isArray(check) ? check : (check?.rows || []);

        if (checkRows.length === 0) {
            return res.status(400).json({ error: "No tienes una entrada abierta hoy o ya registraste tu salida." });
        }

        // 2. ACTUALIZAMOS SALIDA 
        const sql = `
            UPDATE tbl_fichaje_oficina 
            SET salida = $1 
            WHERE idusuario = $2 AND fecha = $3 AND salida IS NULL`;
        
        await dal.execQueryPool(sql, [timestampSalida, idusuario, hoy]);
        
        console.log(`✅ Salida grabada para usuario ${idusuario} a las ${horaSalida}`);
        res.status(200).json({ data: "Salida registrada con éxito" });
    } catch (err: any) {
        console.error("Error en PUT Fichaje:", err?.message || err);
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
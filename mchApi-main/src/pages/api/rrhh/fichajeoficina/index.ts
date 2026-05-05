import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import FichajeOficinaBLL from "@/api/business/FichajeOficinaBLL";

const setCorsHeaders = (res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Token, idlogin');
};

const handler = nc({
    onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
        setCorsHeaders(res);
        res.status(500).json({ error: err?.message || "Error interno del servidor" });
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
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const item = req.body;
        const bll = new (FichajeOficinaBLL as any)(BigInt(item.idusuario), 0, false);
        
        // 1. Validar duplicados hoy (Consultamos la tabla directamente)
        const sqlCheck = `SELECT id FROM tbl_fichaje_oficina WHERE idusuario = $1 AND fecha = $2`;
        const existResult = await bll.dataAcces.execQueryPool(sqlCheck, [item.idusuario, item.fecha]);
        const exists = Array.isArray(existResult) ? existResult : (existResult?.rows || []);

        if (exists.length > 0) {
            return res.status(409).json({ error: "Ya has fichado la entrada hoy." });
        }

        // 2. Insertar
        item.idusuario_ultimo_cambio = item.idusuario;
        try {
            await bll.insert(item);
            return res.status(200).json({ data: "Entrada OK" });
        } catch (e: any) {
            if (e.message.includes('release')) return res.status(200).json({ data: "Entrada OK" });
            throw e;
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
})
.put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { idusuario } = req.body;
        const ahora = new Date();
        const hoy = ahora.toISOString().split('T')[0];
        const horaSalida = ahora.toLocaleTimeString('es-ES', { hour12: false });
        
        const bll = new (FichajeOficinaBLL as any)(BigInt(idusuario), 0, false);

        // 1. Buscar registro abierto de hoy
        const sqlFind = `SELECT * FROM tbl_fichaje_oficina WHERE idusuario = $1 AND fecha = $2 AND (salida IS NULL OR salida = '') LIMIT 1`;
        const findResult = await bll.dataAcces.execQueryPool(sqlFind, [idusuario, hoy]);
        const rows = Array.isArray(findResult) ? findResult : (findResult?.rows || []);

        if (rows.length === 0) {
            return res.status(400).json({ error: "No tienes una entrada abierta hoy." });
        }

        const registro = rows[0];

        // 2. Actualizar salida usando SQL directo para evitar que el BLL cambie el idusuario a 1
        const sqlUpdate = `UPDATE tbl_fichaje_oficina SET salida = $1, idusuario_ultimo_cambio = $2 WHERE id = $3`;
        await bll.dataAcces.execQueryPool(sqlUpdate, [`${hoy} ${horaSalida}`, idusuario, registro.id]);

        return res.status(200).json({ data: "Salida OK" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default handler;
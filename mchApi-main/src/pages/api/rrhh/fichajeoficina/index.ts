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
        res.status(500).json({ error: err?.message || "Error en el servidor" });
    }
})
.options((req, res) => { setCorsHeaders(res); res.status(200).end(); })
.use((req, res, next) => { setCorsHeaders(res); next(); })
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const item = req.body;
        // Instanciamos el BLL solo para obtener el objeto de conexión (dal)
        const bll = new (FichajeOficinaBLL as any)(BigInt(item.idusuario), 0, false);
        const dal = bll.dataAcces;

        // 1. VALIDACIÓN REAL: Consultamos la tabla de fichajes explícitamente
        const sqlCheck = `SELECT id FROM tbl_fichaje_oficina WHERE idusuario = $1 AND fecha = $2 LIMIT 1`;
        const checkResult = await dal.execQueryPool(sqlCheck, [item.idusuario, item.fecha]);
        const rows = Array.isArray(checkResult) ? checkResult : (checkResult?.rows || []);

        if (rows.length > 0) {
            return res.status(409).json({ error: "Ya has fichado la entrada hoy." });
        }

        // 2. INSERCIÓN: Usamos el BLL pero asegurando el campo de auditoría
        item.idusuario_ultimo_cambio = item.idusuario;
        try {
            await bll.insert(item);
            return res.status(200).json({ data: "OK" });
        } catch (e: any) {
            if (e.message.includes('release')) return res.status(200).json({ data: "OK" });
            throw e;
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
})
.put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { idusuario, salida } = req.body;
        const bll = new (FichajeOficinaBLL as any)(BigInt(idusuario), 0, false);
        const dal = bll.dataAcces;
        const hoy = salida.split(' ')[0]; // YYYY-MM-DD

        // 1. BUSCAR REGISTRO: Buscamos el ID en la tabla de fichajes, no en la que diga el BLL
        const sqlFind = `SELECT id FROM tbl_fichaje_oficina WHERE idusuario = $1 AND fecha = $2 AND (salida IS NULL OR salida = '') LIMIT 1`;
        const findResult = await dal.execQueryPool(sqlFind, [idusuario, hoy]);
        const rows = Array.isArray(findResult) ? findResult : (findResult?.rows || []);

        if (rows.length === 0) {
            return res.status(400).json({ error: "No tienes una entrada abierta hoy." });
        }

        // 2. ACTUALIZACIÓN DIRECTA: SQL puro para saltarnos cualquier lógica del BLL que nos asigne el ID 1
        const sqlUpdate = `UPDATE tbl_fichaje_oficina SET salida = $1, idusuario_ultimo_cambio = $2 WHERE id = $3`;
        await dal.execQueryPool(sqlUpdate, [salida, idusuario, rows[0].id]);

        return res.status(200).json({ data: "Salida registrada con éxito" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default handler;
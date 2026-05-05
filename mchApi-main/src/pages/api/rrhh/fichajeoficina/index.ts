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
        res.status(500).json({ error: err?.message || "Error" });
    }
})
.options((req, res) => { setCorsHeaders(res); res.status(200).end(); })
.use((req, res, next) => { setCorsHeaders(res); next(); })
.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const bll = new (FichajeOficinaBLL as any)(BigInt(1), 0, false);
    const dal = bll.dataAcces;
    // Forzamos la lectura de la tabla correcta
    const result = await dal.execQueryPool('SELECT * FROM tbl_fichaje_oficina ORDER BY id DESC LIMIT 100');
    const rows = Array.isArray(result) ? result : (result?.rows || []);
    res.status(200).json({ data: rows });
})
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const item = req.body;
        const bll = new (FichajeOficinaBLL as any)(BigInt(item.idusuario), 0, false);
        const dal = bll.dataAcces;

        // Validamos duplicado con SQL directo
        const check = await dal.execQueryPool('SELECT id FROM tbl_fichaje_oficina WHERE idusuario = $1 AND fecha = $2 LIMIT 1', [item.idusuario, item.fecha]);
        const rows = Array.isArray(check) ? check : (check?.rows || []);
        
        if (rows.length > 0) return res.status(409).json({ error: "Ya existe un fichaje hoy" });

        await bll.insert(item);
        res.status(200).json({ data: "OK" });
    } catch (e: any) {
        if (e.message.includes('release')) return res.status(200).json({ data: "OK" });
        res.status(500).json({ error: e.message });
    }
})
.put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { idusuario, salida, idusuario_ultimo_cambio } = req.body;
        const bll = new (FichajeOficinaBLL as any)(BigInt(idusuario), 0, false);
        const dal = bll.dataAcces;
        const hoy = salida.split(' ')[0];

        // Buscamos el ID del registro abierto hoy para este usuario
        const check = await dal.execQueryPool(
            "SELECT id FROM tbl_fichaje_oficina WHERE idusuario = $1 AND fecha = $2 AND (salida IS NULL OR salida = '') LIMIT 1",
            [idusuario, hoy]
        );
        const rows = Array.isArray(check) ? check : (check?.rows || []);

        if (rows.length === 0) return res.status(400).json({ error: "No hay entrada abierta hoy" });

        // Actualización directa por ID
        await dal.execQueryPool(
            "UPDATE tbl_fichaje_oficina SET salida = $1, idusuario_ultimo_cambio = $2 WHERE id = $3",
            [salida, idusuario_ultimo_cambio, rows[0].id]
        );

        res.status(200).json({ data: "Salida OK" });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default handler;
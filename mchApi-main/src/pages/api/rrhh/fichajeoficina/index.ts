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
    // Permite al front consultar los fichajes
    const el = new (FichajeOficinaBLL as any)(BigInt(1), 0, false);
    const result = await el.get();
    res.status(200).json({ data: result });
})
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const item = req.body;
        const bll = new (FichajeOficinaBLL as any)(BigInt(item.idusuario), 0, false);
        // Inserción directa
        try {
            await bll.insert(item);
            res.status(200).json({ data: "OK" });
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
        const item = req.body; // Aquí recibiremos el objeto completo desde el front
        const bll = new (FichajeOficinaBLL as any)(BigInt(item.idusuario), 0, false);

        try {
            // Usamos el ID que nos manda el front para actualizar exactamente ese registro
            await bll.update(BigInt(item.id), item);
            res.status(200).json({ data: "Salida registrada" });
        } catch (e: any) {
            if (e.message.includes('release')) return res.status(200).json({ data: "Salida registrada" });
            throw e;
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default handler;
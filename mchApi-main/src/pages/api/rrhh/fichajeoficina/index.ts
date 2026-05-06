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
        res.status(500).json({ error: err?.message || "Error Interno" });
    }
})
.options((req, res) => { setCorsHeaders(res); res.status(200).end(); })
.use((req, res, next) => { setCorsHeaders(res); next(); })
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const item = req.body;
        const bll = new (FichajeOficinaBLL as any)(BigInt(item.idusuario), 0, false);
        
        // 1. Buscamos si existe hoy
        const response: any = await bll.getFichajes();
        const lista = Array.isArray(response) ? response : (response?.data || []);
        const yaExiste = lista.find((f: any) => 
            String(f.idusuario) === String(item.idusuario) && String(f.fecha).includes(item.fecha)
        );

        if (yaExiste) return res.status(409).json({ error: "Ya has fichado hoy." });

        // 2. Insertamos directamente
        const result = await bll.insert(item);
        res.status(200).json({ data: result });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
})
.put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { idusuario, [ 'salida' ]: timeSalida } = req.body;
        const hoy = timeSalida.split(' ')[0];
        const bll = new (FichajeOficinaBLL as any)(BigInt(idusuario), 0, false);
        
        const response: any = await bll.getFichajes();
        const lista = Array.isArray(response) ? response : (response?.data || []);

        const registro = lista.find((f: any) => 
            String(f.idusuario) === String(idusuario) && 
            String(f.fecha).includes(hoy) &&
            (!f.salida || String(f.salida).trim() === '' || String(f.salida) === 'null')
        );

        if (!registro) return res.status(400).json({ error: "No se encontró entrada abierta hoy." });

        // Actualizamos el objeto encontrado
        registro.salida = timeSalida;
        const result = await bll.update(BigInt(registro.id), registro);
        res.status(200).json({ data: result });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default handler;
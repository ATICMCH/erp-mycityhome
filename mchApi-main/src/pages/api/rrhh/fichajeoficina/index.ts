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
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const item = req.body;
        const idUser = BigInt(item.idusuario);
        const hoy = item.fecha; // YYYY-MM-DD

        const bll = new (FichajeOficinaBLL as any)(idUser, 0, false);
        
        // USAMOS EL NUEVO MÉTODO
        const response: any = await bll.getFichajes();
        const lista = Array.isArray(response) ? response : (response?.data || []);

        const yaExiste = lista.find((f: any) => 
            String(f.idusuario) === String(item.idusuario) && 
            String(f.fecha).includes(hoy)
        );

        if (yaExiste) {
            return res.status(409).json({ error: "Ya has fichado la entrada hoy." });
        }

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
        const { idusuario } = req.body;
        const idUser = BigInt(idusuario);
        const ahora = new Date();
        const hoy = ahora.toISOString().split('T')[0];
        const horaSalida = ahora.toLocaleTimeString('es-ES', { hour12: false });

        const bll = new (FichajeOficinaBLL as any)(idUser, 0, false);
        
        // USAMOS EL NUEVO MÉTODO TAMBIÉN AQUÍ
        const response: any = await bll.getFichajes();
        const lista = Array.isArray(response) ? response : (response?.data || []);

        const registro = lista.find((f: any) => 
            String(f.idusuario) === String(idusuario) && 
            String(f.fecha).includes(hoy) &&
            (!f.salida || String(f.salida).trim() === '' || String(f.salida) === 'null')
        );

        if (!registro) {
            return res.status(400).json({ error: "No se encontró entrada abierta hoy." });
        }

        registro.salida = `${hoy} ${horaSalida}`;
        registro.idusuario_ultimo_cambio = idusuario;

        try {
            await bll.update(BigInt(registro.id), registro);
            return res.status(200).json({ data: "Salida OK" });
        } catch (e: any) {
            if (e.message.includes('release')) return res.status(200).json({ data: "Salida OK" });
            throw e;
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default handler;
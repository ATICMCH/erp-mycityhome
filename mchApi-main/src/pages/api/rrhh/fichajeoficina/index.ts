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
        console.error("🔥 Error crítico en API:", err);
        res.status(500).json({ error: err?.message || "Internal Server Error" });
    },
    onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
        setCorsHeaders(res);
        res.status(404).json({ error: "Ruta no encontrada" });
    }
})
.options((req, res) => {
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
        const idUser = BigInt(item.idusuario);
        
        // Instancia limpia
        const bll = new (FichajeOficinaBLL as any)(idUser, 0, false);
        
        // 1. Verificación de duplicados usando el método que ya sabemos que funciona (get)
        const lista: any = await bll.get();
        const datos = Array.isArray(lista) ? lista : (lista?.data || []);
        
        const yaExiste = datos.find((f: any) => 
            String(f.idusuario) === String(item.idusuario) && 
            String(f.fecha).substring(0, 10) === String(item.fecha).substring(0, 10)
        );

        if (yaExiste) {
            return res.status(409).json({ error: "Ya has fichado la entrada hoy." });
        }

        // 2. Inserción
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
        const hoy = new Date().toISOString().split('T')[0];

        const bll = new (FichajeOficinaBLL as any)(idUser, 0, false);
        
        // 1. Buscamos el registro abierto
        const lista: any = await bll.get();
        const datos = Array.isArray(lista) ? lista : (lista?.data || []);
        
        const registro = datos.find((f: any) => 
            String(f.idusuario) === String(idusuario) && 
            String(f.fecha).substring(0, 10) === hoy &&
            (!f.salida || String(f.salida).trim() === '' || String(f.salida) === 'null')
        );

        if (!registro) {
            return res.status(400).json({ error: "No se encontró una entrada abierta para hoy." });
        }

        // 2. Actualizamos salida
        const horaSalida = new Date().toLocaleTimeString('es-ES', { hour12: false });
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
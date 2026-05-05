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
    const el = new (FichajeOficinaBLL as any)(BigInt(1), 0, false);
    const result = await el.get();
    res.status(200).json({ data: result });
})
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const item = req.body;
        const idUser = BigInt(item.idusuario);
        
        // 1. Instancia para lectura
        const elRead = new (FichajeOficinaBLL as any)(idUser, 0, false);
        const response: any = await elRead.get();
        const lista = Array.isArray(response) ? response : (response?.data || []);

        // 2. Validación de duplicado hoy
        const hoy = item.fecha; // YYYY-MM-DD
        const yaExiste = lista.find((f: any) => 
            String(f.idusuario) === String(item.idusuario) && 
            String(f.fecha).includes(hoy)
        );

        if (yaExiste) {
            return res.status(409).json({ error: "Ya has fichado la entrada hoy." });
        }

        // 3. Inserción
        const elWrite = new (FichajeOficinaBLL as any)(idUser, 0, false);
        try {
            await elWrite.insert(item);
            return res.status(200).json({ data: "Entrada registrada" });
        } catch (e: any) {
            if (e.message.includes('release')) return res.status(200).json({ data: "Entrada registrada" });
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
        const hoy = ahora.toISOString().split('T')[0]; // YYYY-MM-DD
        const horaSalida = ahora.toLocaleTimeString('es-ES', { hour12: false });

        // 1. Buscar el registro abierto de hoy
        const elRead = new (FichajeOficinaBLL as any)(idUser, 0, false);
        const response: any = await elRead.get();
        const lista = Array.isArray(response) ? response : (response?.data || []);

        // Buscamos el registro de este usuario, de hoy, que NO tenga salida
        const registro = lista.find((f: any) => 
            String(f.idusuario) === String(idusuario) && 
            String(f.fecha).includes(hoy) &&
            (f.salida === null || f.salida === undefined || f.salida === '')
        );

        if (!registro) {
            return res.status(400).json({ error: "No se encontró una entrada abierta para hoy." });
        }

        // 2. Actualizar salida
        const elWrite = new (FichajeOficinaBLL as any)(idUser, 0, false);
        registro.salida = `${hoy} ${horaSalida}`;
        registro.idusuario_ultimo_cambio = idusuario;

        try {
            await elWrite.update(BigInt(registro.id), registro);
            return res.status(200).json({ data: "Salida registrada" });
        } catch (e: any) {
            if (e.message.includes('release')) return res.status(200).json({ data: "Salida registrada" });
            throw e;
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export const config = { api: { bodyParser: { sizeLimit: '1mb' } } };
export default handler;
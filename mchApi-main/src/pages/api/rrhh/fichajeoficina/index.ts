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
        const hoy = item.fecha;

        // 1. Instancia para leer
        const elRead = new (FichajeOficinaBLL as any)(idUser, 0, false);
        const resp: any = await elRead.get();
        const lista = Array.isArray(resp) ? resp : (resp?.data || []);

        // VALIDACIÓN ANTI-DUPLICADOS
        const existe = lista.find((f: any) => 
            String(f.idusuario) === String(item.idusuario) && String(f.fecha).includes(hoy)
        );

        if (existe) return res.status(409).json({ error: "Ya has fichado hoy." });

        // 2. Instancia para insertar
        const elWrite = new (FichajeOficinaBLL as any)(idUser, 0, false);
        try {
            await elWrite.insert(item);
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
        const idUser = BigInt(idusuario);
        const ahora = new Date();
        const hoy = ahora.toISOString().split('T')[0];
        const horaSalida = ahora.toLocaleTimeString('es-ES', { hour12: false });

        // 1. Buscar registro abierto
        const elRead = new (FichajeOficinaBLL as any)(idUser, 0, false);
        const resp: any = await elRead.get();
        const lista = Array.isArray(resp) ? resp : (resp?.data || []);

        const registro = lista.find((f: any) => 
            String(f.idusuario) === String(idusuario) && 
            String(f.fecha).includes(hoy) &&
            (!f.salida || String(f.salida).trim() === '' || String(f.salida) === 'null')
        );

        if (!registro) return res.status(400).json({ error: "No hay entrada abierta hoy." });

        // 2. Preparar objeto para UPDATE
        // TRUCO: Clonamos el objeto y forzamos el idusuario correcto para que el BLL no lo cambie a 1
        const datosUpdate = { ...registro, salida: `${hoy} ${horaSalida}`, idusuario: idusuario };

        const elWrite = new (FichajeOficinaBLL as any)(idUser, 0, false);
        try {
            await elWrite.update(BigInt(registro.id), datosUpdate);
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
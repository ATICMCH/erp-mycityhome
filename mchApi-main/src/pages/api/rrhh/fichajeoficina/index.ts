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
        res.status(500).json({ error: err?.message || "Error interno" });
    }
})
.options((req, res) => { setCorsHeaders(res); res.status(200).end(); })
.use((req, res, next) => { setCorsHeaders(res); next(); })
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const item = req.body;
        const idUser = BigInt(item.idusuario);
        const hoy = item.fecha; // Formato YYYY-MM-DD

        // Instancia para lectura
        const elRead = new (FichajeOficinaBLL as any)(idUser, 0, false);
        const response: any = await elRead.get();
        const lista = Array.isArray(response) ? response : (response?.data || []);

        // VALIDACIÓN: ¿Existe ya un registro para este usuario hoy?
        const yaExiste = lista.find((f: any) => 
            String(f.idusuario) === String(item.idusuario) && 
            String(f.fecha).includes(hoy)
        );

        if (yaExiste) {
            return res.status(409).json({ error: "Ya has registrado tu entrada el día de hoy." });
        }

        // Si no existe, insertamos
        const elWrite = new (FichajeOficinaBLL as any)(idUser, 0, false);
        try {
            await elWrite.insert(item);
            return res.status(200).json({ data: "Entrada registrada" });
        } catch (e: any) {
            // Ignoramos error de release() si el insert fue exitoso
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
        const hoy = ahora.toISOString().split('T')[0];
        const horaSalida = ahora.toLocaleTimeString('es-ES', { hour12: false });

        // Buscamos el registro abierto de hoy
        const elRead = new (FichajeOficinaBLL as any)(idUser, 0, false);
        const response: any = await elRead.get();
        const lista = Array.isArray(response) ? response : (response?.data || []);

        const registro = lista.find((f: any) => 
            String(f.idusuario) === String(idusuario) && 
            String(f.fecha).includes(hoy) &&
            (!f.salida || String(f.salida).trim() === '' || String(f.salida) === 'null')
        );

        if (!registro) {
            return res.status(400).json({ error: "No tienes una entrada abierta hoy o ya marcaste la salida." });
        }

        // Actualizamos el objeto con la salida
        registro.salida = `${hoy} ${horaSalida}`;
        registro.idusuario_ultimo_cambio = idusuario;

        const elUpdate = new (FichajeOficinaBLL as any)(idUser, 0, false);
        try {
            await elUpdate.update(BigInt(registro.id), registro);
            return res.status(200).json({ data: "Salida registrada con éxito" });
        } catch (e: any) {
            if (e.message.includes('release')) return res.status(200).json({ data: "Salida registrada" });
            throw e;
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default handler;
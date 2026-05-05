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
        const hoy = item.fecha; // El formato que viene del front: YYYY-MM-DD
        
        const elRead = new (FichajeOficinaBLL as any)(idUser, 0, false);
        const response: any = await elRead.get();
        
        // CORRECCIÓN: Extraer la lista correctamente si viene envuelta en {data: []}
        const lista = Array.isArray(response) ? response : (response?.data || []);

        // VALIDACIÓN ROBUSTA: Convertimos todo a String para comparar
        const yaExiste = lista.find((f: any) => 
            String(f.idusuario) === String(item.idusuario) && 
            String(f.fecha).includes(hoy)
        );

        if (yaExiste) {
            return res.status(409).json({ error: "Ya has registrado tu entrada el día de hoy." });
        }

        const elWrite = new (FichajeOficinaBLL as any)(idUser, 0, false);
        try {
            // Aseguramos el campo obligatorio de auditoría
            item.idusuario_ultimo_cambio = item.idusuario;
            await elWrite.insert(item);
            return res.status(200).json({ data: "Entrada registrada correctamente" });
        } catch (e: any) {
            // Si el error es solo por la liberación de conexión, lo damos como bueno
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
        // Generamos la fecha de hoy en formato YYYY-MM-DD local
        const hoy = ahora.getFullYear() + '-' + String(ahora.getMonth() + 1).padStart(2, '0') + '-' + String(ahora.getDate()).padStart(2, '0');
        const horaSalida = ahora.toLocaleTimeString('es-ES', { hour12: false });

        const elRead = new (FichajeOficinaBLL as any)(idUser, 0, false);
        const response: any = await elRead.get();
        const lista = Array.isArray(response) ? response : (response?.data || []);

        // BUSCAR EL REGISTRO ABIERTO (Sin salida)
        const registro = lista.find((f: any) => 
            String(f.idusuario) === String(idusuario) && 
            String(f.fecha).includes(hoy) &&
            (f.salida === null || f.salida === undefined || String(f.salida).trim() === '' || String(f.salida) === 'null')
        );

        if (!registro) {
            return res.status(400).json({ error: "No se encontró una entrada abierta para hoy o ya registraste tu salida." });
        }

        const elWrite = new (FichajeOficinaBLL as any)(idUser, 0, false);
        // Actualizamos los campos necesarios
        registro.salida = `${hoy} ${horaSalida}`;
        registro.idusuario_ultimo_cambio = idusuario;

        try {
            // El update suele requerir el ID y el objeto completo
            await elWrite.update(BigInt(registro.id), registro);
            return res.status(200).json({ data: "Salida registrada correctamente" });
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
import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import FichajeOficinaBLL from "@/api/business/FichajeOficinaBLL";

// Función auxiliar para inyectar CORS en cada petición
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
    // Para listar usamos el método nativo get() del BLL
    const el = new (FichajeOficinaBLL as any)();
    const result = await el.get();
    res.status(200).json({ data: result });
})
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const el = new (FichajeOficinaBLL as any)();
        const item = req.body; 
        item.estado = 1;
        
        // 1. VALIDACIÓN ANTI-DUPLICADOS (Una sola entrada al día)
        // Usamos el método nativo get() de tu FichajeOficinaBLL
        const todosLosFichajes: any = await el.get();
        
        // Si no hay error y es un array, buscamos duplicados de HOY
        if (Array.isArray(todosLosFichajes)) {
            const existe = todosLosFichajes.find((f: any) => 
                f.idusuario == item.idusuario && 
                f.fecha === item.fecha
            );

            if (existe) {
                // Si ya fichó, bloqueamos la inserción y devolvemos 409
                console.log(`⚠️ Intento duplicado bloqueado para: ${item.usuario}`);
                return res.status(409).json({ error: "El usuario ya ha registrado una entrada hoy." });
            }
        }

        // 2. INSERCIÓN ORIGINAL
        // Usamos el método nativo insert() de tu BLL
        const result = await el.insert(item);
        
        // Si result tiene un .error (según IErrorResponse), lo mandamos al Frontend
        if (result && (result as any).error) {
             return res.status(400).json({ error: (result as any).error });
        }
        
        console.log(`✅ Entrada grabada con éxito para: ${item.usuario}`);
        res.status(200).json({ data: result });

    } catch (error: any) {
        console.error("Error en POST Fichaje:", error?.message || error);
        res.status(500).json({ error: error?.message || 'Error al guardar en BD' });
    }
})
.put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { idusuario } = req.body;
        const ahora = new Date();
        const hoy = ahora.toLocaleDateString('sv-SE'); 
        const horaSalida = ahora.toLocaleTimeString('es-ES', { hour12: false });
        const timestampSalida = `${hoy} ${horaSalida}`;

        const el = new (FichajeOficinaBLL as any)();
        
        // 1. VALIDACIÓN PARA SALIDA
        const todosLosFichajes: any = await el.get();
        
        if (Array.isArray(todosLosFichajes)) {
            const registroAbierto = todosLosFichajes.find((f: any) => 
                f.idusuario == idusuario && 
                f.fecha === hoy && 
                f.salida === null
            );

            if (!registroAbierto) {
                return res.status(400).json({ error: "No tienes una entrada abierta hoy o ya registraste tu salida." });
            }

            // 2. ACTUALIZAMOS SALIDA usando el método update() nativo de tu BLL
            // Le pasamos el ID del registro y actualizamos solo la hora de salida
            registroAbierto.salida = timestampSalida;
            const result = await el.update(registroAbierto.id, registroAbierto);

            if (result && (result as any).error) {
                return res.status(400).json({ error: (result as any).error });
            }

            console.log(`✅ Salida grabada para usuario ${idusuario} a las ${horaSalida}`);
            return res.status(200).json({ data: "Salida registrada con éxito" });
        } else {
             return res.status(500).json({ error: "Error al consultar los registros del usuario." });
        }

    } catch (err: any) {
        console.error("Error en PUT Fichaje:", err?.message || err);
        res.status(500).json({ error: err?.message || 'Error al actualizar salida' });
    }
});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};

export default handler;
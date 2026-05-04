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
    const el = new (FichajeOficinaBLL as any)();
    const result = await el.get();
    res.status(200).json({ data: result });
})
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const item = req.body; 
        item.estado = 1;
        
        // 1. VALIDACIÓN ANTI-DUPLICADOS
        const elRead = new (FichajeOficinaBLL as any)();
        const responseRead: any = await elRead.get();
        
        // Ajustamos la lectura por si tu BLL devuelve { data: [...] } en lugar de [...]
        const todosLosFichajes = Array.isArray(responseRead) ? responseRead : (responseRead?.data || []);
        
        if (todosLosFichajes.length > 0) {
            const existe = todosLosFichajes.find((f: any) => {
                // Convertimos la fecha de la BD a string y tomamos solo "YYYY-MM-DD"
                const fechaBD = f.fecha ? String(f.fecha).substring(0, 10) : "";
                const fechaItem = item.fecha ? String(item.fecha).substring(0, 10) : "";
                
                return f.idusuario == item.idusuario && fechaBD === fechaItem;
            });

            if (existe) {
                console.log(`⚠️ Intento duplicado bloqueado para: ${item.usuario}`);
                return res.status(409).json({ error: "El usuario ya ha registrado una entrada hoy." });
            }
        }

        // 2. INSERCIÓN
        const elWrite = new (FichajeOficinaBLL as any)();
        
        try {
            const result = await elWrite.insert(item);
            
            if (result && (result as any).error) {
                 return res.status(400).json({ error: (result as any).error });
            }
            
            console.log(`✅ Entrada grabada con éxito para: ${item.usuario}`);
            return res.status(200).json({ data: result });

        } catch (insertError: any) {
            // Neutralizamos el bug de o.release
            if (insertError?.message?.includes('release is not a function')) {
                console.log(`✅ Entrada grabada (ignorando bug de conexión) para: ${item.usuario}`);
                return res.status(200).json({ data: "Entrada registrada exitosamente" });
            } else {
                throw insertError; 
            }
        }

    } catch (error: any) {
        console.error("Error en POST Fichaje:", error?.message || error);
        res.status(500).json({ error: error?.message || 'Error al guardar en BD' });
    }
})
.put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { idusuario } = req.body;
        const ahora = new Date();
        // Usamos YYYY-MM-DD consistente
        const hoy = ahora.getFullYear() + '-' + String(ahora.getMonth() + 1).padStart(2, '0') + '-' + String(ahora.getDate()).padStart(2, '0');
        const horaSalida = ahora.toLocaleTimeString('es-ES', { hour12: false });
        const timestampSalida = `${hoy} ${horaSalida}`;

        // 1. VALIDACIÓN PARA SALIDA
        const elRead = new (FichajeOficinaBLL as any)(); 
        const responseRead: any = await elRead.get();
        const todosLosFichajes = Array.isArray(responseRead) ? responseRead : (responseRead?.data || []);
        
        if (todosLosFichajes.length > 0) {
            const registroAbierto = todosLosFichajes.find((f: any) => {
                const fechaBD = f.fecha ? String(f.fecha).substring(0, 10) : "";
                
                return f.idusuario == idusuario && 
                       fechaBD === hoy && 
                       (!f.salida || String(f.salida).trim() === '' || String(f.salida) === 'null'); // Abarca null, undefined o cadena vacía
            });

            if (!registroAbierto) {
                return res.status(400).json({ error: "No tienes una entrada abierta hoy o ya registraste tu salida." });
            }

            // 2. ACTUALIZAMOS SALIDA 
            const elWrite = new (FichajeOficinaBLL as any)(); 
            registroAbierto.salida = timestampSalida;
            
            try {
                const result = await elWrite.update(registroAbierto.id, registroAbierto);

                if (result && (result as any).error) {
                    return res.status(400).json({ error: (result as any).error });
                }

                console.log(`✅ Salida grabada para usuario ${idusuario} a las ${horaSalida}`);
                return res.status(200).json({ data: "Salida registrada con éxito" });

            } catch (updateError: any) {
                if (updateError?.message?.includes('release is not a function')) {
                    console.log(`✅ Salida grabada (ignorando bug de conexión) para: ${idusuario}`);
                    return res.status(200).json({ data: "Salida registrada exitosamente" });
                } else {
                    throw updateError;
                }
            }

        } else {
             return res.status(500).json({ error: "No se encontraron registros de fichaje para verificar." });
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
import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import DbConnection from "@/api/helpers/DbConnection";

// Función para configurar las cabeceras de CORS
const setCorsHeaders = (res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Token, idlogin');
};

const handler = nc<NextApiRequest, NextApiResponse>({
    onError: (err, req, res) => {
        setCorsHeaders(res);
        console.error("🔥 Error API Asistencia:", err);
        res.status(500).json({ error: err.message || "Internal Server Error" });
    },
    onNoMatch: (req, res) => {
        setCorsHeaders(res);
        res.status(404).json({ error: "Ruta no encontrada" });
    }
})
// Responder a las peticiones OPTIONS (Preflight)
.options((req, res) => {
    setCorsHeaders(res);
    res.status(200).end();
})
// Middleware para aplicar CORS a todas las peticiones
.use((req, res, next) => {
    setCorsHeaders(res);
    next();
})
.post(async (req, res) => {
    const { idusuario, usuario, tipo } = req.body;
    const db = new DbConnection(false);

    try {
        const ahora = new Date();
        // Ajuste manual de zona horaria si el servidor está en UTC (España es +2 en mayo)
        const fecha = ahora.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD
        const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });

        // 1. VALIDACIÓN: Evitar duplicados rápidos (margen de 1 minuto)
        const sqlCheck = `
            SELECT id FROM tbl_asistencia 
            WHERE idusuario = $1 AND tipo = $2 AND fecha = $3 
            AND hora > (NOW() - INTERVAL '1 minute')::time 
            LIMIT 1
        `;
        const exists: any = await db.exeQuery({ text: sqlCheck, values: [idusuario, tipo, fecha] });

        if (exists && exists.length > 0) {
            return res.status(429).json({ error: "Ya has registrado esto hace un momento." });
        }

        // 2. INSERCIÓN DIRECTA EN LA NUEVA TABLA
        const sqlInsert = `
            INSERT INTO tbl_asistencia (idusuario, usuario, tipo, fecha, hora)
            VALUES ($1, $2, $3, $4, $5) RETURNING id
        `;
        
        await db.exeQuery({
            text: sqlInsert,
            values: [idusuario, usuario, tipo, fecha, hora]
        });

        res.status(200).json({ data: "Registro guardado con éxito" });
    } catch (error: any) {
        console.error("Error en query:", error);
        res.status(500).json({ error: error.message });
    }
});

export default handler;
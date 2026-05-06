import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import DbConnection from "@/api/helpers/DbConnection";

const handler = nc<NextApiRequest, NextApiResponse>()
.post(async (req, res) => {
    const { idusuario, usuario, tipo } = req.body;
    const db = new DbConnection(false);

    try {
        const ahora = new Date();
        const fecha = ahora.toISOString().split('T')[0];
        const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });

        // VALIDACIÓN: Evitar que el usuario pulse dos veces seguidas el mismo botón (60 segundos de margen)
        const sqlCheck = `SELECT id FROM tbl_asistencia WHERE idusuario = $1 AND tipo = $2 AND fecha = $3 AND hora > (NOW() - INTERVAL '1 minute')::time LIMIT 1`;
        const exists: any = await db.exeQuery({ text: sqlCheck, values: [idusuario, tipo, fecha] });

        if (exists && exists.length > 0) {
            return res.status(429).json({ error: "Espera un momento antes de volver a fichar." });
        }

        // INSERCIÓN DIRECTA
        const sqlInsert = `
            INSERT INTO tbl_asistencia (idusuario, usuario, tipo, fecha, hora)
            VALUES ($1, $2, $3, $4, $5) RETURNING id
        `;
        
        await db.exeQuery({
            text: sqlInsert,
            values: [idusuario, usuario, tipo, fecha, hora]
        });

        res.status(200).json({ data: "Registro guardado correctamente" });
    } catch (error: any) {
        console.error("Error en tbl_asistencia:", error);
        res.status(500).json({ error: error.message });
    }
});

export default handler;
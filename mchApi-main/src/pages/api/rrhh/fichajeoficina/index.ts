import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import FichajeOficinaBLL from "@/api/business/FichajeOficinaBLL";
import { IFichajeOficina } from "@/api/models/IFichajeOficina";

const handler = nc({
    onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
        console.error("🔥 Error en API Fichaje:", err);
        res.status(500).json({ error: "Internal Server Error" });
    },
    onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
        res.status(404).end("Page is not found");
    }
})
.get(async (req: NextApiRequest, res: NextApiResponse) => {
    // Usamos 'as any' para evitar el error de argumentos en el constructor durante el build
    const el = new (FichajeOficinaBLL as any)();
    const result = await el.list();
    res.status(200).json({ data: result });
})
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    const el = new (FichajeOficinaBLL as any)();
    const item = req.body as IFichajeOficina;
    const result = await el.insert(item);
    res.status(200).json({ data: result });
})
.put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { idusuario } = req.body;
        const ahora = new Date();
        const hoy = ahora.toLocaleDateString('sv-SE'); 
        const horaSalida = ahora.toLocaleTimeString('es-ES', { hour12: false });

        const el = new (FichajeOficinaBLL as any)();
        
        // Buscamos el registro de hoy que no tenga salida
        const sql = `
            UPDATE tbl_fichaje_oficina 
            SET salida = $1 
            WHERE idusuario = $2 AND fecha = $3 AND salida IS NULL`;
        
        // Accedemos al dataAccess interno de la clase
        const dal = (el as any).dataAcces;
        if (dal) {
            await dal.execQueryPool(sql, [`${hoy} ${horaSalida}`, idusuario, hoy]);
            res.status(200).json({ data: "Salida registrada con éxito" });
        } else {
            throw new Error("No se pudo acceder a la base de datos");
        }
    } catch (err: any) {
        console.error("❌ Error PUT Salida:", err.message);
        res.status(500).json({ error: err.message });
    }
});

export default handler;
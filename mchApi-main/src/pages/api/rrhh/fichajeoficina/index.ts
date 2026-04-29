import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import FichajeOficinaBLL from "@/api/business/FichajeOficinaBLL";
import { IFichajeOficina } from "@/api/models/IFichajeOficina";

const handler = nc({
    onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
        console.error("🔥 Error Fichaje API:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const el = new (FichajeOficinaBLL as any)();
    const result = await el.list();
    res.status(200).json({ data: result });
})
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const el = new (FichajeOficinaBLL as any)();
        const item = req.body as IFichajeOficina;
        // Forzamos estado activo
        item.estado = 1;
        const result = await el.insert(item);
        res.status(200).json({ data: result });
    } catch (error: any) {
        // Si ya existe registro hoy, devolvemos 409 para evitar duplicados
        const status = error.message.includes('duplicate') ? 409 : 500;
        res.status(status).json({ error: error.message });
    }
})
.put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { idusuario } = req.body;
        const ahora = new Date();
        const hoy = ahora.toLocaleDateString('sv-SE'); // YYYY-MM-DD
        const horaSalida = ahora.toLocaleTimeString('es-ES', { hour12: false });
        const timestampSalida = `${hoy} ${horaSalida}`;

        const el = new (FichajeOficinaBLL as any)();
        const dal = (el as any).dataAcces;

        // Buscamos el registro de hoy del usuario que aún no tenga salida grabada
        const sql = `
            UPDATE tbl_fichaje_oficina 
            SET salida = $1 
            WHERE idusuario = $2 AND fecha = $3 AND salida IS NULL`;
        
        await dal.execQueryPool(sql, [timestampSalida, idusuario, hoy]);
        
        console.log(`✅ Salida grabada para usuario ${idusuario} a las ${horaSalida}`);
        res.status(200).json({ data: "Salida registrada con éxito" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default handler;
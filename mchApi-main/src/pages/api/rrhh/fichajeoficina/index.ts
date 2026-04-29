import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import FichajeOficinaBLL from "@/api/business/FichajeOficinaBLL";
import { IFichajeOficina } from "@/api/models/IFichajeOficina";

const handler = nc({
    onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
        console.error("🔥 Error Fichaje:", err);
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
        // Forzamos que el estado sea 1 (Activo)
        item.estado = 1;
        const result = await el.insert(item);
        console.log("✅ Entrada registrada para:", item.usuario);
        res.status(200).json({ data: result });
    } catch (error: any) {
        res.status(error.message.includes('duplicate') ? 409 : 500).json({ error: error.message });
    }
})
.put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { idusuario } = req.body;
        const ahora = new Date();
        const hoy = ahora.toLocaleDateString('sv-SE'); 
        const horaSalida = ahora.toLocaleTimeString('es-ES', { hour12: false });
        const salidaFull = `${hoy} ${horaSalida}`;

        const el = new (FichajeOficinaBLL as any)();
        const sql = `UPDATE tbl_fichaje_oficina SET salida = $1 WHERE idusuario = $2 AND fecha = $3 AND salida IS NULL`;
        
        await (el as any).dataAcces.execQueryPool(sql, [salidaFull, idusuario, hoy]);
        console.log("👋 Salida registrada para ID:", idusuario);
        res.status(200).json({ data: "Salida OK" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default handler;
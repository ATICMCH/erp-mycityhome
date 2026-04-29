import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import FichajeOficinaBLL from "@/api/business/FichajeOficinaBLL";
import { IFichajeOficina } from "@/api/models/IFichajeOficina";

const handler = nc({
  onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
    res.status(500).json({ error: "Internal Server Error" });
  }
})
.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const el = new FichajeOficinaBLL();
    const result = await el.list();
    res.status(200).json({ data: result });
})
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    const el = new FichajeOficinaBLL();
    const item = req.body as IFichajeOficina;
    const result = await el.insert(item);
    res.status(200).json({ data: result });
})
// --- MÉTODO PUT PARA ACTUALIZAR SALIDA ---
.put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { idusuario } = req.body;
        const ahora = new Date();
        const hoy = ahora.toLocaleDateString('sv-SE'); // YYYY-MM-DD
        const horaSalida = ahora.toLocaleTimeString('es-ES', { hour12: false });

        const el = new FichajeOficinaBLL();
        // SQL para marcar salida solo si está vacía
        const sql = `
            UPDATE tbl_fichaje_oficina 
            SET salida = $1 
            WHERE idusuario = $2 AND fecha = $3 AND salida IS NULL`;
        
        await (el as any).dataAcces.execQueryPool(sql, [`${hoy} ${horaSalida}`, idusuario, hoy]);
        
        res.status(200).json({ data: "Salida registrada con éxito" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default handler;
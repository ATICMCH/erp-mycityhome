import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import FichajeOficinaBLL from "@/api/business/FichajeOficinaBLL";
import { IFichajeOficina } from "@/api/models/IFichajeOficina";
import { IResponse } from "@/api/modelsextra/IResponse";
import { IErrorResponse } from "@/api/modelsextra/IErrorResponse";

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
// --- MÉTODO NUEVO PARA SALIDA ---
.put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { idusuario } = req.body;
        const ahora = new Date();
        const hoy = ahora.toLocaleDateString('sv-SE');
        const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });
        
        const el = new FichajeOficinaBLL();
        // Accedemos al DAL para hacer el update de la salida
        const sql = `
            UPDATE tbl_fichaje_oficina 
            SET salida = $1 
            WHERE idusuario = $2 AND fecha = $3 AND salida IS NULL`;
        
        await (el as any).dataAcces.execQueryPool(sql, [`${hoy} ${hora}`, idusuario, hoy]);
        
        res.status(200).json({ data: "Salida registrada" });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar salida" });
    }
});

export default handler;
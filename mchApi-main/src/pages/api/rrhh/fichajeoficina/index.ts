import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import FichajeOficinaBLL from "@/api/business/FichajeOficinaBLL";
import { IFichajeOficina } from "@/api/models/IFichajeOficina";
import DataDataAccess from "@/api/data/DataDataAccess";

const handler = nc({
    onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
        console.error("🔥 Fichaje Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
.get(async (req: NextApiRequest, res: NextApiResponse) => {
    // Instanciamos con los argumentos requeridos por el constructor
    const el = new FichajeOficinaBLL(new DataDataAccess());
    const result = await el.list();
    res.status(200).json({ data: result });
})
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    const el = new FichajeOficinaBLL(new DataDataAccess());
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

        const el = new FichajeOficinaBLL(new DataDataAccess());
        
        // Ejecutamos la consulta de actualización de salida
        const sql = `
            UPDATE tbl_fichaje_oficina 
            SET salida = $1 
            WHERE idusuario = $2 AND fecha = $3 AND salida IS NULL`;
        
        const dal = (el as any).dataAcces;
        await dal.execQueryPool(sql, [`${hoy} ${horaSalida}`, idusuario, hoy]);
        
        res.status(200).json({ data: "Salida registrada con éxito" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default handler;
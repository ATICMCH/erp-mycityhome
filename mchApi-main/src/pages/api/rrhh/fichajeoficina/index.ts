import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import FichajeOficinaBLL from "@/api/business/FichajeOficinaBLL";
import { IFichajeOficina } from "@/api/models/IFichajeOficina";

// Middleware para habilitar CORS y evitar el bloqueo del navegador
const enableCors = (req: NextApiRequest, res: NextApiResponse, next: any) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Token, idlogin');
    
    // Si es una petición de pre-verificación (OPTIONS), respondemos OK inmediatamente
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
};

const handler = nc({
    onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
        console.error("🔥 Error Fichaje API:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
.use(enableCors) // Aplicamos el permiso CORS a todas las rutas de este archivo
.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const el = new (FichajeOficinaBLL as any)();
    const result = await el.list();
    res.status(200).json({ data: result });
})
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const el = new (FichajeOficinaBLL as any)();
        const item = req.body as IFichajeOficina;
        item.estado = 1;
        const result = await el.insert(item);
        res.status(200).json({ data: result });
    } catch (error: any) {
        const status = error.message.includes('duplicate') ? 409 : 500;
        res.status(status).json({ error: error.message });
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
        const dal = (el as any).dataAcces;

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
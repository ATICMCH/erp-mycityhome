import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import FichajeOficinaBLL from "@/api/business/FichajeOficinaBLL";

const setCorsHeaders = (res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Token, idlogin');
};

const handler = nc<NextApiRequest, NextApiResponse>()
.use((req, res, next) => {
    setCorsHeaders(res);
    next();
})
.options((req, res) => {
    setCorsHeaders(res);
    res.status(200).end();
})
.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { idusuario, usuario, tipo } = req.body;
        
        // Instanciamos tu BLL (usamos 0 y false como parámetros por defecto)
        const bll = new (FichajeOficinaBLL as any)(BigInt(idusuario), 0, false);

        // Llamamos al nuevo método que interactúa con la base de datos de forma segura
        const result = await bll.registrarAsistenciaSimple(idusuario, usuario, tipo);

        if (result && !result.error) {
            return res.status(200).json({ data: "Registro guardado con éxito" });
        } else {
            throw new Error(result.error || "Error desconocido en BD");
        }
    } catch (error: any) {
        console.error("🔥 Error API:", error.message);
        res.status(500).json({ error: error.message });
    }
})
.get(async (req, res) => {
    try {
        const { usuario, tipo, fecha } = req.query;
        // Instanciamos la lógica de negocio
        const bll = new (FichajeOficinaBLL as any)(BigInt(1), 0, false);
        
        // Llamamos al método de consulta que ya tienes en el BLL
        // Si no existe el método 'consultarAsistencias' en tu BLL, lo añadiremos en el siguiente paso
        const data = await bll.consultarAsistencias({ 
            usuario: usuario as string, 
            tipo: tipo as string, 
            fecha: fecha as string 
        });

        res.status(200).json({ data });
    } catch (error: any) {
        console.error("Error en API GET asistencias:", error);
        res.status(500).json({ error: error.message });
    }
  });

export default handler;
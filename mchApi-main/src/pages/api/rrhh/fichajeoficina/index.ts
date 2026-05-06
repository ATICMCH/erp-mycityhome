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
});

export default handler;
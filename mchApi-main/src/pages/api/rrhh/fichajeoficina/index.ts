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
        if (!idusuario || !tipo) return res.status(400).json({ error: "Datos incompletos" });

        const bll = new (FichajeOficinaBLL as any)(BigInt(idusuario), 0, false);

        const result = await bll.registrarAsistenciaSimple(idusuario, usuario, tipo);

        // Si el resultado es un objeto con la propiedad 'error'
        if (result && result.error) {
            return res.status(409).json({ error: result.error });
        }

        // Si tenemos un ID, es que se guardó correctamente
        if (result && (result.id || !result.error)) {
            return res.status(200).json({ data: "Registro guardado con éxito" });
        }
        
        return res.status(500).json({ error: "No se pudo confirmar el guardado." });

    } catch (error: any) {
        console.error("🔥 Error en Endpoint Asistencia:", error);
        res.status(500).json({ error: error.message });
    }
});

export default handler;
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
    const bll = new (FichajeOficinaBLL as any)(BigInt(idusuario), 0, false);

    const result = await bll.registrarAsistenciaSimple(idusuario, usuario, tipo);

    // Si el resultado trae la propiedad 'error' (la que pusimos en el DAL)
    if (result && result.error) {
        return res.status(409).json({ error: result.error });
    }

    if (result && !result.error) {
        return res.status(200).json({ data: "Registro guardado con éxito" });
    }
} catch (error: any) {
    res.status(500).json({ error: error.message });
}
});

export default handler;
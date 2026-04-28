import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import AuthUserBusiness from "@/api/business/AuthUserBusiness";
import { IAuthUser } from "@/api/modelsextra/IAuthUser";
import { IResponse } from "@/api/modelsextra/IResponse";
import { IErrorResponse } from "@/api/modelsextra/IErrorResponse";
import Constants from "@/api/helpers/Constants";

const handler = nc({
    onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
        console.error("🔥 API Error:", err?.stack || err);
        res.status(500).json({ error: "Internal Server Error" });
    },
    onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
        res.status(404).end("Page is not found");
    }
})
.post(async (req: NextApiRequest, res: NextApiResponse<IResponse | IErrorResponse>) => {
    try {
        const rawBody: any = req.body || {};
        const user: string = (rawBody.user || rawBody.email || rawBody.username || '').toString();
        const password: string = (rawBody.password || rawBody.pass || '').toString();

        if (!user || !password) {
            return res.status(400).json({ error: 'Missing user or password' });
        }

        let el: AuthUserBusiness = new AuthUserBusiness();
        let dataDB: IAuthUser | IErrorResponse = await el.authUser(user, password);

        if (!dataDB || (dataDB as IErrorResponse).error) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const authUser = dataDB as IAuthUser;

        if (authUser.estado === Constants.code_status_baja) return res.status(403).json({ error: 'user blocked' });
        if (authUser.estado === Constants.code_status_delete) return res.status(404).json({ error: 'user delete' });

        console.log("✅ Login exitoso para:", authUser.username);
        return res.status(200).json({ data: authUser });

    } catch (error: any) {
        console.error("💥 Excepción en Login:", error);
        return res.status(500).json({ error: "Error inesperado en el servidor" });
    }
});

export default handler;
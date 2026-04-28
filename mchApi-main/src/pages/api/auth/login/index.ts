import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import AuthUserBusiness from "@/api/business/AuthUserBusiness";
import { IAuthUser } from "@/api/modelsextra/IAuthUser";
import { IResponse } from "@/api/modelsextra/IResponse";
import { IErrorResponse } from "@/api/modelsextra/IErrorResponse";
import Constants from "@/api/helpers/Constants";
import UtilInstance from "@/api/helpers/Util";

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

        let el: AuthUserBusiness = new AuthUserBusiness();
        let dataDB: IAuthUser | IErrorResponse = await el.authUser(user, password);

        if (!dataDB || (dataDB as IErrorResponse).error) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const authUser = dataDB as any;

        // --- LÓGICA DE FICHAJE INTEGRADA (SIN CONEXIONES NUEVAS) ---
        try {
            const ahora = new Date();
            const hoy = ahora.toLocaleDateString('sv-SE'); 
            const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });
            const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').toString().split(',')[0];

            // Accedemos al objeto de acceso a datos que YA usa la clase AuthUserBusiness
            // Esto evita problemas de "password authentication failed"
            const dal = (el as any).dataAcces; 

            if (dal && typeof dal.execQueryPool === 'function') {
                const checkSql = `SELECT id FROM tbl_fichaje_oficina WHERE idusuario = ${authUser.id} AND fecha = '${hoy}' LIMIT 1`;
                const existe = await dal.execQueryPool(checkSql);

                if (!existe || existe.length === 0) {
                    const insertSql = `
                        INSERT INTO tbl_fichaje_oficina 
                        (idusuario, usuario, fecha, entrada, estado, tipo_ejecucion, ip, observacion, idusuario_ultimo_cambio, jornada, horario, token) 
                        VALUES (
                            ${authUser.id}, 
                            '${authUser.nombre_completo || authUser.username}', 
                            '${hoy}', 
                            '${hora}', 
                            1, 
                            'automático', 
                            '${ip}', 
                            'Fichaje automático Backend', 
                            ${authUser.id}, 
                            '${authUser.jornada || 'Jornada Completa'}', 
                            '${authUser.horario || 'HC'}', 
                            '${UtilInstance.getUUID()}'
                        )`;
                    await dal.execQueryPool(insertSql);
                    console.log(`✅ Fichaje guardado automáticamente para ${authUser.username}`);
                }
            }
        } catch (fichajeError) {
            console.error("⚠️ Error silencioso en fichaje:", fichajeError);
            // No bloqueamos el login si el fichaje falla
        }
        // --- FIN LÓGICA FICHAJE ---

        return res.status(200).json({ data: authUser });

    } catch (error: any) {
        console.error("💥 Error General:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default handler;
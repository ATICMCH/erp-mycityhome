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

        console.log("🔑 INTENTO DE LOGIN PARA:", user);

        let el: AuthUserBusiness = new AuthUserBusiness();
        let dataDB: IAuthUser | IErrorResponse = await el.authUser(user, password);

        if (!dataDB || (dataDB as IErrorResponse).error) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const authUser = dataDB as any;
        console.log("✅ Login OK para:", authUser.username);

        // --- FICHAJE AUTOMÁTICO DIRECTO ---
        try {
            const ahora = new Date();
            const hoy = ahora.toLocaleDateString('sv-SE'); 
            const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });
            const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').toString().split(',')[0];
            
            // Intentamos obtener el DAL de cualquier forma posible (ofuscada o no)
            const dal = (el as any).dataAcces || (el as any)._dataAcces || (el as any).i;

            if (dal) {
                console.log("🚀 Lanzando INSERT de fichaje...");
                
                const sqlInsert = `
                    INSERT INTO tbl_fichaje_oficina 
                    (idusuario, usuario, fecha, entrada, estado, tipo_ejecucion, ip, observacion, idusuario_ultimo_cambio, jornada, horario, token) 
                    VALUES (
                        ${authUser.id}, 
                        '${authUser.nombre_completo || authUser.username}', 
                        '${hoy}', 
                        '${hoy} ${hora}', 
                        1, 
                        'automático', 
                        '${ip}', 
                        'Fichaje Login Directo', 
                        ${authUser.id}, 
                        '${authUser.jornada || 'Jornada Completa'}', 
                        '${authUser.horario || 'HC'}', 
                        '${UtilInstance.getUUID()}'
                    )`;

                // Usamos await para asegurar que termine antes de que el login responda
                await dal.execQueryPool(sqlInsert);
                console.log("✅ ¡REGISTRO CONFIRMADO EN BASE DE DATOS!");
            } else {
                console.error("❌ No se encontró el objeto de base de datos (DAL)");
            }
        } catch (fError: any) {
            console.error("⚠️ Error en el INSERT:", fError.message);
        }

        return res.status(200).json({ data: authUser });

    } catch (error: any) {
        console.error("💥 Error Crítico:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default handler;
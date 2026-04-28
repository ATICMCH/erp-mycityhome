import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import AuthUserBusiness from "@/api/business/AuthUserBusiness";
import { IAuthUser } from "@/api/modelsextra/IAuthUser";
import { IResponse } from "@/api/modelsextra/IResponse";
import { IErrorResponse } from "@/api/modelsextra/IErrorResponse";
import Constants from "@/api/helpers/Constants";
import UtilInstance from "@/api/helpers/Util";
import { Pool } from "pg";
// Importamos la configuración como un objeto plano para que no se ofusque
import DbConfig from "@/api/helpers/DbConfiguration";

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
        console.log("✅ Login exitoso para:", authUser.username);

        // --- FICHAJE POR CONEXIÓN DIRECTA (INDEPENDIENTE DEL SISTEMA) ---
        // Usamos una función autoejecutada para no bloquear la respuesta del login
        (async () => {
            // Extraemos la config real (a veces viene dentro de .config)
            const finalConfig = (DbConfig as any).config || DbConfig;
            const pool = new Pool(finalConfig);
            
            try {
                const ahora = new Date();
                const hoy = ahora.toLocaleDateString('sv-SE'); 
                const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });
                const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').toString().split(',')[0];

                console.log("⏱️ Verificando y registrando fichaje directo...");

                // 1. Verificar si ya existe hoy
                const check = await pool.query(
                    'SELECT id FROM tbl_fichaje_oficina WHERE idusuario = $1 AND fecha = $2 LIMIT 1',
                    [authUser.id, hoy]
                );

                if (check.rowCount === 0) {
                    const sql = `
                        INSERT INTO tbl_fichaje_oficina 
                        (idusuario, usuario, fecha, entrada, estado, tipo_ejecucion, ip, observacion, idusuario_ultimo_cambio, jornada, horario, token) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
                    
                    const values = [
                        authUser.id,
                        authUser.nombre_completo || authUser.username,
                        hoy,
                        `${hoy} ${hora}`,
                        1,
                        'automático',
                        ip,
                        'Fichaje automático LOGIN',
                        authUser.id,
                        authUser.jornada || 'Jornada Completa',
                        authUser.horario || 'HC',
                        UtilInstance.getUUID()
                    ];

                    await pool.query(sql, values);
                    console.log("🚀 [DB] Fichaje guardado con éxito mediante conexión directa.");
                } else {
                    console.log("ℹ️ [DB] El usuario ya tiene fichaje hoy.");
                }
            } catch (dbErr: any) {
                console.error("❌ [DB] Error en conexión directa:", dbErr.message);
            } finally {
                await pool.end(); // Cerramos la conexión para no saturar el servidor
            }
        })();
        // --- FIN FICHAJE ---

        return res.status(200).json({ data: authUser });

    } catch (error: any) {
        console.error("💥 Error Crítico:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default handler;
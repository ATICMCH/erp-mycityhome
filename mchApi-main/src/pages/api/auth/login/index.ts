import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import AuthUserBusiness from "@/api/business/AuthUserBusiness";
import { IAuthUser } from "@/api/modelsextra/IAuthUser";
import { IResponse } from "@/api/modelsextra/IResponse";
import { IErrorResponse } from "@/api/modelsextra/IErrorResponse";
import Constants from "@/api/helpers/Constants";

const handler = nc(
      {
            onError: (err: any, req: NextApiRequest, res: NextApiResponse, next: any) => {
                  console.error("🔥 API Error:", err?.stack || err);
                  res.status(500).json({ error: "Internal Server Error" });
            },
            onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
                  res.status(404).end("Page is not found");
            }
      })
      .post(async (req: NextApiRequest, res: NextApiResponse<IResponse | IErrorResponse>) => {
            try {
                  const rawBody: any = req.body || {}
                  const user: string = (rawBody.user || rawBody.email || rawBody.username || '').toString()
                  const password: string = (rawBody.password || rawBody.pass || '').toString()

                  let el: AuthUserBusiness = new AuthUserBusiness()
                  let dataDB: IAuthUser | IErrorResponse = await el.authUser(user, password)

                  if (!dataDB || (dataDB as IErrorResponse).error) {
                        return res.status(401).json({ error: 'Credenciales inválidas' });
                  }

                  const authUser = dataDB as any; 
                  if (!authUser.id) return res.status(401).json({ error: 'User ID not found' });

                  // --- LOGICA DE FICHAJE MEDIANTE WEBHOOK INTERNO ---
                  // Preparamos los datos del usuario para el fichaje
                  const dataForFichaje = {
                        idusuario: authUser.id,
                        usuario: authUser.nombre_completo || authUser.username,
                        jornada: authUser.jornada || 'Jornada Completa',
                        horario: authUser.horario || 'HC',
                        ip: (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').toString().split(',')[0]
                  };

                  // Disparamos la petición interna sin esperar (async) para que no bloquee el login
                  // Usamos la URL local para asegurar que la petición sea independiente
                  const protocol = req.headers['x-forwarded-proto'] || 'http';
                  const host = req.headers.host;
                  
                  fetch(`${protocol}://${host}/api/rrhh/fichajeoficina`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                              ...dataForFichaje,
                              tipo_ejecucion: 'automático',
                              observacion: 'Entrada automática LOGIN API'
                        })
                  }).then(() => console.log("📡 Webhook de fichaje enviado con éxito"))
                    .catch(e => console.error("❌ Fallo al enviar Webhook:", e.message));
                  // --- FIN LOGICA FICHAJE ---

                  console.log("✅ Login exitoso:", authUser.username);
                  return res.status(200).json({ data: authUser });

            } catch (error: any) {
                  console.error("💥 Error General:", error);
                  return res.status(500).json({ error: "Internal Server Error" });
            }
      })

export default handler;
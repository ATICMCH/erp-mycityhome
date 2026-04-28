import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import AuthUserBusiness from "@/api/business/AuthUserBusiness";
import FichajeOficinaBLL from "@/api/business/FichajeOficinaBLL"; // Importamos la lógica de fichaje
import { IAuthUser } from "@/api/modelsextra/IAuthUser";
import { IResponse } from "@/api/modelsextra/IResponse";
import { IErrorResponse } from "@/api/modelsextra/IErrorResponse";
import { Constants } from "@/api/helpers/Constants";
import { Util } from "@/api/helpers/Util";

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

                  console.log(`🔑 Intento de login para usuario: [${user}]`);

                  if (!user || !password) {
                        return res.status(400).json({ error: 'Missing user or password' })
                  }

                  let el: AuthUserBusiness = new AuthUserBusiness()
                  let dataDB: IAuthUser | IErrorResponse = await el.authUser(user, password)

                  // 1. Caso: Usuario no encontrado
                  if (!dataDB) {
                        console.log("❌ Usuario no encontrado o contraseña incorrecta");
                        return res.status(401).json({ error: 'Credenciales inválidas' })
                  }

                  // 2. Caso: Error devuelto por la lógica de negocio
                  if ((dataDB as IErrorResponse).error) {
                        let _d = dataDB as IErrorResponse;
                        console.error("💾 Error SQL en Login:", _d.error);
                        return res.status(_d.code || 404).json(_d);
                  }

                  const authUser = dataDB as IAuthUser;

                  // 3. Caso: Usuario inactivo (Baja)
                  if (authUser.estado === Constants.code_status_baja) {
                        console.log("🚫 Usuario bloqueado");
                        return res.status(403).json({ error: 'user blocked' })
                  }

                  // 4. Caso: Usuario eliminado
                  if (authUser.estado === Constants.code_status_delete) {
                        console.log("🗑️ Usuario eliminado");
                        return res.status(404).json({ error: 'user delete' })
                  }

                  // --- LÓGICA DE FICHAJE AUTOMÁTICO ---
                  try {
                        const fichajeBLL = new FichajeOficinaBLL();
                        const hoy = new Date().toISOString().split('T')[0];
                        
                        // Obtenemos la IP del cliente
                        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

                        // Verificamos si ya tiene un fichaje de entrada hoy para no duplicar
                        const fichajesHoy = await fichajeBLL.getAllFilter(authUser.id, hoy, hoy);
                        
                        if (!fichajesHoy || (Array.isArray(fichajesHoy) && fichajesHoy.length === 0)) {
                              console.log(`⏱️ Registrando fichaje automático para: ${authUser.username}`);
                              
                              await fichajeBLL.create({
                                    idusuario: authUser.id,
                                    usuario: authUser.nombre || authUser.username, // Nombre completo o usuario
                                    fecha: hoy,
                                    entrada: new Date().toLocaleTimeString('es-ES', { hour12: false }),
                                    estado: 1,
                                    tipo_ejecucion: 'AUTOMATICO_LOGIN',
                                    ip: ip.toString(),
                                    observacion: 'Fichaje automático generado al iniciar sesión'
                              });
                        } else {
                              console.log(`ℹ️ El usuario ${authUser.username} ya tiene un fichaje registrado hoy.`);
                        }
                  } catch (fichajeError) {
                        // Importante: No bloqueamos el login si falla el fichaje, solo lo logueamos
                        console.error("⚠️ Error en fichaje automático:", fichajeError);
                  }
                  // --- FIN LÓGICA DE FICHAJE ---

                  // 5. ÉXITO: Login correcto
                  console.log("✅ Login exitoso para:", authUser.username);
                  return res.status(200).json({ data: authUser });

            } catch (error: any) {
                  console.error("💥 Excepción en Login Handler:", error);
                  return res.status(500).json({ error: "Error inesperado en el servidor" });
            }
      })

export default handler;
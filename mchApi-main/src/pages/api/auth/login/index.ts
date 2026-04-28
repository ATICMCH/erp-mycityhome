import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import AuthUserBusiness from "@/api/business/AuthUserBusiness";
import FichajeOficinaBLL from "@/api/business/FichajeOficinaBLL";
import { IAuthUser } from "@/api/modelsextra/IAuthUser";
import { IResponse } from "@/api/modelsextra/IResponse";
import { IErrorResponse } from "@/api/modelsextra/IErrorResponse";
import Constants from "@/api/helpers/Constants";
import { IFichajeOficina } from "@/api/models/IFichajeOficina";
import UtilInstance from "@/api/helpers/Util";

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

                  if (!user || !password) {
                        return res.status(400).json({ error: 'Missing user or password' })
                  }

                  let el: AuthUserBusiness = new AuthUserBusiness()
                  let dataDB: IAuthUser | IErrorResponse = await el.authUser(user, password)

                  if (!dataDB || (dataDB as IErrorResponse).error) {
                        return res.status(401).json({ error: 'Credenciales inválidas' });
                  }

                  // Usamos 'any' temporalmente para acceder a campos que no están en la interfaz IAuthUser
                  const authUser = dataDB as any; 

                  if (!authUser.id) {
                        return res.status(401).json({ error: 'User ID not found' });
                  }

                  if (authUser.estado === Constants.code_status_baja) {
                        return res.status(403).json({ error: 'user blocked' })
                  }

                  if (authUser.estado === Constants.code_status_delete) {
                        return res.status(404).json({ error: 'user delete' })
                  }

                  // --- LÓGICA DE FICHAJE AUTOMÁTICO ---
                  try {
                        const idUsuarioBigInt = BigInt(authUser.id);
                        const fichajeBLL = new FichajeOficinaBLL(idUsuarioBigInt, 0, false);
                        
                        const ahora = new Date();
                        // Ajuste de zona horaria manual para asegurar formato SQL local (YYYY-MM-DD)
                        const hoySQL = ahora.toLocaleDateString('sv-SE'); 
                        const fullDateTime = ahora.toLocaleString('sv-SE').replace('T', ' ');

                        // Verificar si ya fichó hoy
                        const registros: any = await fichajeBLL.get();
                        const yaFichoHoy = Array.isArray(registros) && registros.some((f: any) => 
                              f.idusuario?.toString() === authUser.id?.toString() && 
                              f.fecha?.toString().includes(hoySQL)
                        );

                        if (!yaFichoHoy) {
                              console.log(`⏱️ Intentando registro automático para: ${authUser.username}`);
                              
                              const nuevoFichaje: IFichajeOficina = {
                                    idusuario: idUsuarioBigInt,
                                    usuario: authUser.nombre || authUser.username || 'Sistema',
                                    fecha: hoySQL,
                                    entrada: fullDateTime,
                                    estado: 1,
                                    tipo_ejecucion: 'automático',
                                    ip: (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '0.0.0.0').toString(),
                                    observacion: 'Entrada automática por login',
                                    idusuario_ultimo_cambio: idUsuarioBigInt,
                                    // Solución a errores ts(2339):
                                    jornada: authUser.jornada || 'Jornada Completa',
                                    horario: authUser.horario || 'HC',
                                    token: UtilInstance.getUUID() // Aunque sea null en DB, la interfaz lo pide
                              };

                              const result = await fichajeBLL.insert(nuevoFichaje);
                              
                              if ((result as IErrorResponse).error) {
                                    console.error("❌ Error devuelto por BLL:", (result as IErrorResponse).error);
                              } else {
                                    console.log("✅ Fichaje registrado exitosamente en DB");
                              }
                        } else {
                              console.log("ℹ️ El usuario ya tiene fichaje para el día de hoy.");
                        }
                  } catch (fichajeError) {
                        console.error("⚠️ Error en el proceso de fichaje:", fichajeError);
                  }

                  return res.status(200).json({ data: authUser });

            } catch (error: any) {
                  console.error("💥 Excepción grave en Login:", error);
                  return res.status(500).json({ error: "Internal Server Error" });
            }
      })

export default handler;
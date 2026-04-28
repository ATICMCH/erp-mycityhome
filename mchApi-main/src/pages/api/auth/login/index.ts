import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import AuthUserBusiness from "@/api/business/AuthUserBusiness";
import FichajeOficinaDAL from "@/api/data/FichajeOficinaDAL"; // Importamos el DAL directamente
import { IAuthUser } from "@/api/modelsextra/IAuthUser";
import { IResponse } from "@/api/modelsextra/IResponse";
import { IErrorResponse } from "@/api/modelsextra/IErrorResponse";
import Constants from "@/api/helpers/Constants";
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

                  let el: AuthUserBusiness = new AuthUserBusiness()
                  let dataDB: IAuthUser | IErrorResponse = await el.authUser(user, password)

                  if (!dataDB || (dataDB as IErrorResponse).error) {
                        return res.status(401).json({ error: 'Credenciales inválidas' });
                  }

                  const authUser = dataDB as any; 
                  if (!authUser.id) return res.status(401).json({ error: 'User ID not found' });

                  // --- LOGICA DE FICHAJE DIRECTA (DAL) ---
                  const registrarEntrada = async () => {
                        try {
                              const idUsuario = BigInt(authUser.id);
                              // Usamos el DAL directamente para saltar bloqueos de instancia BLL
                              const dal = new FichajeOficinaDAL(idUsuario, 0, false);
                              
                              const ahora = new Date();
                              const hoySQL = ahora.toLocaleDateString('sv-SE'); 
                              const horaSQL = ahora.toLocaleTimeString('es-ES', { hour12: false });

                              // Verificamos si ya existe el registro hoy para este usuario
                              const sqlCheck = `SELECT id FROM tbl_fichaje_oficina WHERE idusuario = $1 AND fecha = $2 LIMIT 1`;
                              const checkExist: any = await (dal as any).execQueryPool(sqlCheck, [authUser.id, hoySQL]);

                              if (!checkExist || checkExist.length === 0) {
                                    console.log(`⏱️ Insertando fichaje directo para: ${authUser.username}`);
                                    
                                    const sqlInsert = `
                                          INSERT INTO tbl_fichaje_oficina 
                                          (idusuario, usuario, fecha, entrada, estado, tipo_ejecucion, ip, observacion, idusuario_ultimo_cambio, jornada, horario, token) 
                                          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
                                    
                                    const params = [
                                          authUser.id,
                                          authUser.nombre_completo || authUser.username,
                                          hoySQL,
                                          horaSQL,
                                          1, // estado activo
                                          'automático',
                                          (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').toString().split(',')[0],
                                          'Entrada automática por LOGIN',
                                          authUser.id,
                                          authUser.jornada || 'Jornada Completa',
                                          authUser.horario || 'HC',
                                          UtilInstance.getUUID()
                                    ];

                                    await (dal as any).execQueryPool(sqlInsert, params);
                                    console.log("✅ FICHAJE REGISTRADO EN BASE DE DATOS");
                              }
                        } catch (err: any) {
                              console.error("⚠️ Error en inserción directa:", err.message);
                        }
                  };

                  // Ejecutamos sin esperar para que el login sea instantáneo
                  registrarEntrada();
                  // --- FIN LÓGICA FICHAJE ---

                  console.log("✅ Login exitoso:", authUser.username);
                  return res.status(200).json({ data: authUser });

            } catch (error: any) {
                  console.error("💥 Error General:", error);
                  return res.status(500).json({ error: "Internal Server Error" });
            }
      })

export default handler;
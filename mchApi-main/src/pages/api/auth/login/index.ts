import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import AuthUserBusiness from "@/api/business/AuthUserBusiness";
import { IAuthUser } from "@/api/modelsextra/IAuthUser";
import { IResponse } from "@/api/modelsextra/IResponse";
import { IErrorResponse } from "@/api/modelsextra/IErrorResponse";
import Constants from "@/api/helpers/Constants";
import UtilInstance from "@/api/helpers/Util";
import { Pool } from "pg"; 
import DbConfiguration from "@/api/helpers/DbConfiguration"; 

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

                  // --- PROCESO DE FICHAJE (CONEXIÓN NATIVA CON COMPATIBILIDAD DE CONFIG) ---
                  const registrarFichajeLogin = async () => {
                        // Usamos 'as any' para que Pool acepte la configuración aunque falten tipos estrictos
                        // y extraemos la propiedad .config si existiera (patrón común en tu ERP)
                        const config = (DbConfiguration as any).config || DbConfiguration;
                        const pool = new Pool(config);
                        
                        try {
                              const ahora = new Date();
                              const hoySQL = ahora.toLocaleDateString('sv-SE'); 
                              const horaSQL = ahora.toLocaleTimeString('es-ES', { hour12: false });
                              const ipCliente = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').toString().split(',')[0];

                              const checkRes = await pool.query(
                                    `SELECT id FROM tbl_fichaje_oficina WHERE idusuario = $1 AND fecha = $2 LIMIT 1`,
                                    [authUser.id, hoySQL]
                              );

                              if (checkRes.rowCount === 0) {
                                    console.log(`⏱️ Registrando fichaje para: ${authUser.nombre_completo}`);
                                    
                                    await pool.query(
                                          `INSERT INTO tbl_fichaje_oficina 
                                          (idusuario, usuario, fecha, entrada, estado, tipo_ejecucion, ip, observacion, idusuario_ultimo_cambio, jornada, horario, token) 
                                          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                                          [
                                                authUser.id, 
                                                authUser.nombre_completo || authUser.username, 
                                                hoySQL, 
                                                horaSQL, 
                                                1, 
                                                'automático', 
                                                ipCliente, 
                                                'Entrada automática LOGIN', 
                                                authUser.id, 
                                                authUser.jornada || 'Jornada Completa', 
                                                authUser.horario || 'HC', 
                                                UtilInstance.getUUID()
                                          ]
                                    );
                                    console.log("✅ REGISTRO INSERTADO CON ÉXITO");
                              }
                        } catch (err: any) {
                              console.error("⚠️ Error en DB Fichaje:", err.message);
                        } finally {
                              await pool.end();
                        }
                  };

                  registrarFichajeLogin();

                  console.log("✅ Login exitoso:", authUser.username);
                  return res.status(200).json({ data: authUser });

            } catch (error: any) {
                  console.error("💥 Error General:", error);
                  return res.status(500).json({ error: "Internal Server Error" });
            }
      })

export default handler;
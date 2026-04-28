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

                  if (!dataDB) {
                        return res.status(401).json({ error: 'Credenciales inválidas' })
                  }

                  if ((dataDB as IErrorResponse).error) {
                        let _d = dataDB as IErrorResponse;
                        return res.status(_d.code || 404).json(_d);
                  }

                  const authUser = dataDB as IAuthUser;

                  if (authUser.estado === Constants.code_status_baja) {
                        return res.status(403).json({ error: 'user blocked' })
                  }

                  if (authUser.estado === Constants.code_status_delete) {
                        return res.status(404).json({ error: 'user delete' })
                  }

                  // --- INICIO LÓGICA DE FICHAJE AUTOMÁTICO ---
                  try {
                        // 1. Instanciamos con los parámetros requeridos por tu constructor
                        // idUserLogin, filterStatus, isTransactions, infoExtra
                        const fichajeBLL = new FichajeOficinaBLL(BigInt(authUser.id), 0, false);
                        
                        // 2. Preparar fechas en el formato que espera tu validador SQL
                        const ahora = new Date();
                        const hoySQL = ahora.toISOString().split('T')[0]; // YYYY-MM-DD
                        
                        // El validador de tu BLL usa 'checkFormatDateTimeSQL', 
                        // por lo que necesita 'YYYY-MM-DD HH:mm:ss'
                        const fullDateTime = ahora.toISOString().replace('T', ' ').split('.')[0];

                        // 3. Verificar si ya existe registro hoy
                        // Usamos get() que llama a dataAcces.get() y filtramos manualmente o 
                        // si tu DAL permite filtros, ajustarlo. Aquí simulamos la entrada:
                        const registrosExistentes: any = await fichajeBLL.get();
                        
                        const yaFichoHoy = Array.isArray(registrosExistentes) && registrosExistentes.some((f: any) => 
                              f.idusuario.toString() === authUser.id.toString() && 
                              f.fecha === hoySQL
                        );

                        if (!yaFichoHoy) {
                              console.log(`⏱️ Registrando entrada automática para: ${authUser.username}`);
                              
                              const nuevoFichaje: IFichajeOficina = {
                                    idusuario: BigInt(authUser.id),
                                    usuario: authUser.nombre || authUser.username,
                                    fecha: hoySQL,
                                    entrada: fullDateTime, // Formato completo para pasar validación BLL
                                    estado: 1,
                                    tipo_ejecucion: 'automático',
                                    ip: (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString(),
                                    observacion: 'Fichaje automático por inicio de sesión'
                              };

                              const result = await fichajeBLL.insert(nuevoFichaje);
                              
                              if ((result as IErrorResponse).error) {
                                    console.error("❌ Error de validación en BLL:", (result as IErrorResponse).error);
                              }
                        }
                  } catch (fichajeError) {
                        console.error("⚠️ Error crítico en proceso de fichaje:", fichajeError);
                  }
                  // --- FIN LÓGICA DE FICHAJE ---

                  console.log("✅ Login exitoso para:", authUser.username);
                  return res.status(200).json({ data: authUser });

            } catch (error: any) {
                  console.error("💥 Excepción en Login:", error);
                  return res.status(500).json({ error: "Internal Server Error" });
            }
      })

export default handler;
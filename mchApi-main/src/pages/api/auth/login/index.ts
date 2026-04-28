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

                  let el: AuthUserBusiness = new AuthUserBusiness()
                  let dataDB: IAuthUser | IErrorResponse = await el.authUser(user, password)

                  if (!dataDB || (dataDB as IErrorResponse).error) {
                        return res.status(401).json({ error: 'Credenciales inválidas' });
                  }

                  const authUser = dataDB as any; 
                  if (!authUser.id) return res.status(401).json({ error: 'User ID not found' });

                  // --- PROCESO DE FICHAJE AUTOMÁTICO (OPTIMIZADO PARA EVITAR COLISIÓN DE CLIENTE DB) ---
                  // Ejecutamos el fichaje "en segundo plano" para no bloquear el Login
                  (async () => {
                        try {
                              // Pequeña pausa de 300ms para asegurar que la conexión del login se libere
                              await new Promise(resolve => setTimeout(resolve, 300));

                              const idUsuarioBigInt = BigInt(authUser.id);
                              const fichajeBLL = new FichajeOficinaBLL(idUsuarioBigInt, 0, false);
                              
                              const ahora = new Date();
                              const hoySQL = ahora.toLocaleDateString('sv-SE'); 
                              const fullDateTime = ahora.toLocaleString('sv-SE').replace('T', ' ').split('.')[0];

                              // Verificamos si ya existe hoy
                              const registros: any = await fichajeBLL.get();
                              const yaFichoHoy = Array.isArray(registros) && registros.some((f: any) => 
                                    f.idusuario?.toString() === authUser.id.toString() && 
                                    (f.fecha?.toString().includes(hoySQL) || f.fecha === hoySQL)
                              );

                              if (!yaFichoHoy) {
                                    console.log(`⏱️ Registrando entrada automática para: ${authUser.nombre_completo}`);
                                    
                                    const nuevoFichaje: IFichajeOficina = {
                                          idusuario: idUsuarioBigInt,
                                          usuario: authUser.nombre_completo || authUser.username || 'Sistema',
                                          fecha: hoySQL,
                                          entrada: fullDateTime,
                                          estado: 1,
                                          tipo_ejecucion: 'automático',
                                          ip: (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').toString().split(',')[0],
                                          observacion: 'Fichaje automático LOGIN',
                                          idusuario_ultimo_cambio: idUsuarioBigInt,
                                          token: UtilInstance.getUUID(),
                                          jornada: authUser.jornada || 'Jornada Completa',
                                          horario: authUser.horario || 'HC'
                                    };

                                    const result = await fichajeBLL.insert(nuevoFichaje);
                                    
                                    if ((result as IErrorResponse).error) {
                                          console.error("❌ Error Validación:", JSON.stringify((result as IErrorResponse).data));
                                    } else {
                                          console.log("✅ FICHAJE GUARDADO EXITOSAMENTE");
                                    }
                              } else {
                                    console.log("ℹ️ El usuario ya había fichado hoy.");
                              }
                        } catch (err) {
                              console.error("⚠️ Error interno en fichaje:", err);
                        }
                  })(); 
                  // --- FIN FICHAJE ---

                  console.log("✅ Login exitoso:", authUser.username);
                  return res.status(200).json({ data: authUser });

            } catch (error: any) {
                  console.error("💥 Error General:", error);
                  return res.status(500).json({ error: "Internal Server Error" });
            }
      })

export default handler;
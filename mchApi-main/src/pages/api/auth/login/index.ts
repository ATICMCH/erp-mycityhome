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

                  // --- LOGICA DE FICHAJE (DESACOPLADA) ---
                  // Guardamos los datos necesarios en constantes para que estén disponibles en el hilo secundario
                  const userDataForFichaje = {
                        id: authUser.id,
                        nombre: authUser.nombre_completo || authUser.username,
                        jornada: authUser.jornada,
                        horario: authUser.horario,
                        ip: (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').toString().split(',')[0]
                  };

                  // Usamos un delay mayor y lo sacamos del flujo principal
                  setTimeout(async () => {
                        try {
                              const idUsuarioBigInt = BigInt(userDataForFichaje.id);
                              // Creamos una instancia nueva con una conexión fresca
                              const fichajeBLL = new FichajeOficinaBLL(idUsuarioBigInt, 0, false);
                              
                              const ahora = new Date();
                              const hoySQL = ahora.toLocaleDateString('sv-SE'); 
                              const fullDateTime = ahora.toLocaleString('sv-SE').replace('T', ' ').split('.')[0];

                              // 1. Verificar duplicados (Usamos get() que es lo que tiene tu BLL)
                              const registros: any = await fichajeBLL.get();
                              const yaFichoHoy = Array.isArray(registros) && registros.some((f: any) => 
                                    f.idusuario?.toString() === userDataForFichaje.id.toString() && 
                                    f.fecha?.toString().includes(hoySQL)
                              );

                              if (!yaFichoHoy) {
                                    console.log(`⏱️ Registrando entrada diferida para: ${userDataForFichaje.nombre}`);
                                    
                                    const nuevoFichaje: IFichajeOficina = {
                                          idusuario: idUsuarioBigInt,
                                          usuario: userDataForFichaje.nombre,
                                          fecha: hoySQL,
                                          entrada: fullDateTime,
                                          estado: 1,
                                          tipo_ejecucion: 'automático',
                                          ip: userDataForFichaje.ip,
                                          observacion: 'Fichaje automático LOGIN',
                                          idusuario_ultimo_cambio: idUsuarioBigInt,
                                          token: UtilInstance.getUUID(),
                                          jornada: userDataForFichaje.jornada || 'Jornada Completa',
                                          horario: userDataForFichaje.horario || 'HC'
                                    };

                                    await fichajeBLL.insert(nuevoFichaje);
                                    console.log("✅ Fichaje guardado correctamente en diferido.");
                              }
                        } catch (err: any) {
                              console.error("⚠️ Error diferido en fichaje:", err.message);
                        }
                  }, 1000); // Esperamos 1 segundo completo para liberar la DB
                  // --- FIN LOGICA FICHAJE ---

                  console.log("✅ Login exitoso:", authUser.username);
                  return res.status(200).json({ data: authUser });

            } catch (error: any) {
                  console.error("💥 Error General:", error);
                  return res.status(500).json({ error: "Internal Server Error" });
            }
      })

export default handler;
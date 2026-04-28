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

                  // Casting a 'any' para manejar los campos reales que vemos en el log de Chrome
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
                        // Pasamos parámetros correctos al constructor del BLL
                        const fichajeBLL = new FichajeOficinaBLL(idUsuarioBigInt, 0, false);
                        
                        // Obtenemos fecha actual en formato local YYYY-MM-DD
                        const ahora = new Date();
                        const hoySQL = ahora.toLocaleDateString('sv-SE'); // Formato: 2026-04-28
                        const fullDateTime = ahora.toLocaleString('sv-SE').replace('T', ' ').split('.')[0];

                        console.log(`🔎 Verificando fichaje previo para usuario ${authUser.id} en fecha ${hoySQL}...`);

                        // 1. Obtener registros para evitar duplicados
                        const registros: any = await fichajeBLL.get();
                        
                        const yaFichoHoy = Array.isArray(registros) && registros.some((f: any) => 
                              f.idusuario?.toString() === authUser.id.toString() && 
                              (f.fecha?.toString().includes(hoySQL) || f.fecha === hoySQL)
                        );

                        if (!yaFichoHoy) {
                              console.log(`⏱️ Registrando entrada para: ${authUser.nombre_completo || authUser.username}`);
                              
                              const nuevoFichaje: IFichajeOficina = {
                                    idusuario: idUsuarioBigInt,
                                    // Usamos 'nombre_completo' que es lo que devuelve tu objeto según el log de Chrome
                                    usuario: authUser.nombre_completo || authUser.username || 'Sistema',
                                    fecha: hoySQL,
                                    entrada: fullDateTime,
                                    estado: 1,
                                    tipo_ejecucion: 'automático',
                                    ip: (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').toString().split(',')[0],
                                    observacion: 'Entrada automática por login',
                                    idusuario_ultimo_cambio: idUsuarioBigInt,
                                    token: UtilInstance.getUUID(),
                                    // Estos campos son NOT NULL en tu DB:
                                    jornada: authUser.jornada || 'Jornada Completa',
                                    horario: authUser.horario || 'HC'
                              };

                              const result = await fichajeBLL.insert(nuevoFichaje);
                              
                              if ((result as IErrorResponse).error) {
                                    console.error("❌ Error BLL validation:", JSON.stringify((result as IErrorResponse).data));
                              } else {
                                    console.log("✅ Fichaje registrado en DB correctamente.");
                              }
                        } else {
                              console.log(`ℹ️ Usuario ${authUser.username} ya tiene fichaje hoy.`);
                        }
                  } catch (errFichaje: any) {
                        console.error("⚠️ Excepción en proceso de fichaje:", errFichaje.message);
                  }
                  // --- FIN LÓGICA ---

                  console.log("✅ Login exitoso para:", authUser.username);
                  return res.status(200).json({ data: authUser });

            } catch (error: any) {
                  console.error("💥 Excepción Login:", error);
                  return res.status(500).json({ error: "Internal Server Error" });
            }
      })

export default handler;
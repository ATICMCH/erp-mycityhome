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

                  // Casting a any para acceder a jornada/horario sin errores de TS
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
                        
                        // Formatos exactos requeridos por Validations.ts (YYYY-MM-DD y YYYY-MM-DD HH:mm:ss)
                        const ahora = new Date();
                        const hoySQL = ahora.toISOString().split('T')[0]; 
                        const fullDateTime = ahora.toISOString().replace('T', ' ').split('.')[0];

                        // 1. Verificación de duplicados
                        const registros: any = await fichajeBLL.get();
                        const yaFichoHoy = Array.isArray(registros) && registros.some((f: any) => 
                              f.idusuario?.toString() === authUser.id?.toString() && 
                              f.fecha?.toString().includes(hoySQL)
                        );

                        if (!yaFichoHoy) {
                              console.log(`⏱️ Registrando fichaje para: ${authUser.username} (${hoySQL})`);
                              
                              const nuevoFichaje: IFichajeOficina = {
                                    idusuario: idUsuarioBigInt,
                                    usuario: authUser.nombre || authUser.username || 'Sistema',
                                    fecha: hoySQL,
                                    entrada: fullDateTime,
                                    estado: 1,
                                    tipo_ejecucion: 'automático',
                                    ip: (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').toString(),
                                    observacion: 'Entrada automática por login',
                                    idusuario_ultimo_cambio: idUsuarioBigInt,
                                    token: UtilInstance.getUUID(),
                                    jornada: authUser.jornada || 'Jornada Completa',
                                    horario: authUser.horario || 'HC'
                              };

                              // 2. Ejecutar inserción y capturar respuesta
                              const result = await fichajeBLL.insert(nuevoFichaje);
                              
                              if ((result as IErrorResponse).error) {
                                    // Si hay error de validación, se imprimirá aquí
                                    console.error("❌ Error de validación BLL:", JSON.stringify((result as IErrorResponse).data));
                              } else {
                                    console.log("✅ Fichaje registrado correctamente en DB");
                              }
                        } else {
                              console.log(`ℹ️ El usuario ${authUser.username} ya tiene fichaje hoy.`);
                        }
                  } catch (errFichaje) {
                        console.error("⚠️ Error crítico en proceso de fichaje:", errFichaje);
                  }
                  // --- FIN LÓGICA ---

                  console.log("✅ Login exitoso para:", authUser.username);
                  return res.status(200).json({ data: authUser });

            } catch (error: any) {
                  console.error("💥 Excepción grave en Login:", error);
                  return res.status(500).json({ error: "Internal Server Error" });
            }
      })

export default handler;
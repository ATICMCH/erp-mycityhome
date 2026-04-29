import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import AuthUserBusiness from '@/api/business/AuthUserBusiness'
import { IAuthUser } from '@/api/modelsextra/IAuthUser'
import { IErrorResponse } from '@/api/modelsextra/IErrorResponse'
import Constants from '@/api/helpers/Constants'
import { IResponse } from '@/api/modelsextra/IResponse'

const handler = nc(
      {
            onError: (err: any, req: NextApiRequest, res: NextApiResponse, next: any) => {
                  console.error("ðŸ”¥ API Error:", err?.stack || err);
                  // Eliminado 'details' para cumplir con la interfaz
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

                  console.log(`ðŸ”‘ Intento de login para usuario: [${user}]`);

                  if (!user || !password) {
                        return res.status(400).json({ error: 'Missing user or password' })
                  }

                  let el: AuthUserBusiness = new AuthUserBusiness()
                  let dataDB: IAuthUser | IErrorResponse = await el.authUser(user, password)

                  // 1. Caso: Usuario no encontrado
                  if (!dataDB) {
                        console.log("âŒ Usuario no encontrado o contraseÃ±a incorrecta");
                        return res.status(401).json({ error: 'Credenciales invÃ¡lidas' })
                  }

                  // 2. Caso: Error devuelto por la lÃ³gica de negocio
                  if ((dataDB as IErrorResponse).error) {
                        let _d = dataDB as IErrorResponse;
                        console.error("ðŸ’¾ Error SQL en Login:", _d.error);
                        return res.status(_d.code || 404).json(_d);
                  }

                  const authUser = dataDB as IAuthUser;

                  // 3. Caso: Usuario inactivo (Baja)
                  if (authUser.estado === Constants.code_status_baja) {
                        console.log("ðŸš« Usuario bloqueado");
                        return res.status(403).json({ error: 'user blocked' })
                  }

                  // 4. Caso: Usuario eliminado
                  if (authUser.estado === Constants.code_status_delete) {
                        console.log("ðŸ—‘ï¸ Usuario eliminado");
                        return res.status(404).json({ error: 'user delete' })
                  }

                  // 5. Ã‰XITO: Login correcto
                  console.log("âœ… Login exitoso para:", authUser.username);
                  return res.status(200).json({ data: authUser });

            } catch (error: any) {
                  console.error("ðŸ’¥ ExcepciÃ³n en Login Handler:", error);
                  return res.status(500).json({ error: "Error inesperado en el servidor" });
            }
      })

export default handler
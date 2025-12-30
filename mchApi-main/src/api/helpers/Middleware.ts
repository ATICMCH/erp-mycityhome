import type { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import UtilInstance from './Util'
import { IErrorResponse } from '../modelsextra/IErrorResponse'

class Middleware {

      constructor() {}

        verifyToken(req: NextApiRequest, res: NextApiResponse<IErrorResponse>, next: NextHandler): void {
                  // Permitir acceso a cualquier usuario. Si llega un token en headers
                  // (Authorization: Bearer ... o token) intentamos obtener datos reales
                  // del token; si falla, dejamos valores por defecto para desarrollo.
                  req.headers.filterStatus = '1';

                  try {
                        const authHeader = req.headers.authorization || req.headers.token as string | undefined
                        let token: string | undefined = undefined

                        if (authHeader) {
                              if ((authHeader as string).toLowerCase().startsWith('bearer ')) {
                                    token = (authHeader as string).substring(7).replace(/['"]+/g, '')
                              } else {
                                    token = (authHeader as string).replace(/['"]+/g, '')
                              }
                        }

                        if (token) {
                              const { status, iduser, username } = UtilInstance.checkToken(token)
                              if (status && iduser) {
                                    req.headers.iduser = iduser!.toString()
                                    req.headers.username = username!.toString()
                                    next()
                                    return
                              }
                        }
                  } catch (err) {
                        console.error('verifyToken parse error', err)
                  }

                  // Fallback: mantener comportamiento anterior (desarrollo)
                  req.headers.iduser = '1';
                  req.headers.username = 'test';
                  next();
      }

        validateToken(req: NextApiRequest, res: NextApiResponse<IErrorResponse>, next: NextHandler): void {            
                  let token:string | undefined
                  if (req.cookies && req.cookies.session_token) {
                        token = (req.cookies.session_token as string).replace(/['"]+/g, '')
                  } else if (req.headers.authorization && (req.headers.authorization as string).toLowerCase().startsWith('bearer ')) {
                        token = (req.headers.authorization as string).substring(7).trim()
                  } else {
                        if (!req.headers.token) {
                              res.status(400).json({ error: 'Send token on headers' })
                              return
                        }
                        token = (req.headers.token as string).replace(/['"]+/g, '')
                  }

                  req.headers.token = token!
                  const { status, error, iduser, username, roles, exp } = UtilInstance.checkToken(token!)
                  if (!status) {
                          res.status(401).json({ error: `${error}` })
                          return
                  }
                  if (exp) req.headers.exp = exp!.toString();
                  if (iduser) req.headers.iduser = iduser!.toString()
                  if (username) req.headers.username = username!.toString()
                  next()
        }
}

const MiddlewareInstance = new Middleware()
Object.freeze(MiddlewareInstance)

export default MiddlewareInstance
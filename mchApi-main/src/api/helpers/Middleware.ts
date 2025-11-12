import type { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import UtilInstance from './Util'
import { IErrorResponse } from '../modelsextra/IErrorResponse'

class Middleware {

      constructor() {}

        verifyToken(req: NextApiRequest, res: NextApiResponse<IErrorResponse>, next: NextHandler): void {
            // Permitir acceso a cualquier usuario, sin validar token ni roles ni token
            req.headers.filterStatus = '1';
            req.headers.iduser = '1';
            req.headers.username = 'test';
            next();
      }

      validateToken(req: NextApiRequest, res: NextApiResponse<IErrorResponse>, next: NextHandler): void {            
            let token:string
            if(req.cookies.session_token)
            {
                token = (req.cookies.session_token as string).replace(/['"]+/g, '')
            }
            else{
                if (!req.headers.token) {
                    // 406: NO INTERPRETA SOLICITUD
                    res.status(400).json({ error: 'Send token on headers' })
                    return
              }
              token = (req.headers.token as string).replace(/['"]+/g, '')
            }
            req.headers.token = token
            const { status, error, iduser, username, roles, exp } = UtilInstance.checkToken(token)
            if ( !status ) {
                  // 401: NO AUTORIZADO
                  res.status(401).json({ error: `${error}` })
                  return
            }
            req.headers.exp = exp!.toString();
            req.headers.iduser = iduser!.toString()
            req.headers.username = username!.toString()
            
            next()
      }
}

const MiddlewareInstance = new Middleware()
Object.freeze(MiddlewareInstance)

export default MiddlewareInstance
import Constants from "../helpers/Constants"
import DbConnection from "../helpers/DbConnection"
import UtilInstance from "../helpers/Util"
import { IAuthUser } from "../modelsextra/IAuthUser"
import { IErrorResponse } from "../modelsextra/IErrorResponse"
import { ErrorFieldType } from "../types/GlobalTypes"

class AuthUserDataAccess {
      public client: DbConnection

      constructor() {
            this.client = new DbConnection()
      }

      async authUser(email: string, password: string): Promise<IAuthUser | IErrorResponse> {
            const queryData = {
                  name: 'auth-user',
                  text: `SELECT usu.id, usu.nombre, usu.apellido, usu.email, 
                         usu.estado, usu.username, usu.nombre_completo, 
                         usu.department, usu.multilogin,
                         (CASE
                              WHEN count(srol.*) > 0 THEN jsonb_agg(json_build_object('id', srol.idrol, 'nombre', srol.nombre, 'ismain', srol.ismain))
                              WHEN count(srol.*) = 0 THEN '[]'
                         END) AS roles
                         FROM tbl_usuario usu
                         LEFT JOIN ( SELECT uxr.idusuario, uxr.idrol, r.nombre, uxr.ismain
                                    FROM tbl_usuario_x_rol uxr 
                                    JOIN tbl_rol r on (r.id = uxr.idrol)
                                    JOIN tbl_usuario usu on (usu.id = uxr.idusuario)
                                    WHERE lower(usu.email) LIKE lower($1) OR lower(usu.username) LIKE lower($1)
                                    ORDER BY ismain DESC
                                    ) srol on (srol.idusuario = usu.id)
                         WHERE (lower(usu.email) LIKE lower($1) OR lower(usu.username) LIKE lower($1)) AND usu.password LIKE $2
                         GROUP BY usu.id`,
                  values: [email.trim(), password]
            }

            let lData: Array<IAuthUser  | IErrorResponse> = (await this.client.exeQuery(queryData)) as Array<IAuthUser | IErrorResponse>

            // Ordenamos, para que este al inicio el rol MAIN [true]
            if( lData.length !== 0 && !((lData[0] as IErrorResponse).error) ) {
                  let _d = lData[0] as IAuthUser
                  let _dispositivos = (_d.roles || []).map((el,index) => ({...el, index})).sort((x, y) => Number(y.ismain) - Number(x.ismain))
                  return { ..._d, roles: [ ..._dispositivos ] }
            }
            
            return lData[0]
      }
      
      /**
       * Migración perezosa hacia el login único (tbl_nuevo_login_erp).
       * Se llama solo tras un login correcto contra tbl_usuario: en ese
       * momento, y solo en ese momento, tenemos la contraseña en texto plano
       * para poder generarle un hash Argon2id. Sin login correcto no hay
       * forma de recuperarla del SHA-256 guardado en tbl_usuario.password.
       * Seguro de re-ejecutar: hace upsert por tbl_usuario_id.
       */
      async upsertLoginBridge(user: IAuthUser, plainPassword: string): Promise<void> {
            const passwordHash = await UtilInstance.hashArgon2(plainPassword)
            const rolPrincipal = (user.roles && user.roles.length > 0) ? (user.roles[0] as any).nombre : 'WORKER'
            const nombreCompleto = `${user.nombre ?? ''} ${user.apellido ?? ''}`.trim() || user.username

            const queryData = {
                  name: 'upsert-login-bridge-legacy',
                  text: `INSERT INTO tbl_nuevo_login_erp
                              (email, username, nombre_completo, password_hash, rol, estado, tbl_usuario_id, ultimo_login)
                        VALUES (lower($1), $2, $3, $4, $5, $6, $7, now())
                        ON CONFLICT (tbl_usuario_id) DO UPDATE SET
                              email = EXCLUDED.email,
                              username = EXCLUDED.username,
                              nombre_completo = EXCLUDED.nombre_completo,
                              password_hash = EXCLUDED.password_hash,
                              rol = EXCLUDED.rol,
                              estado = EXCLUDED.estado,
                              ultimo_login = now(),
                              actualizado_en = now()`,
                  values: [ user.email, user.username, nombreCompleto, passwordHash, rolPrincipal, user.estado, user.id ]
            }

            // Fresh connection, not this.client: DbConnection closes its client at
            // the end of exeQuery(), and authUser() above already used this.client
            // once in the same request -- reusing it here throws "Client has
            // already been connected", same as every other DAL in this codebase
            // that runs more than one query.
            await new DbConnection().exeQuery(queryData)
      }

      async resetPassword(id: BigInt, password: string, idUserLogin: BigInt, filterStatus: number = 1): Promise<IAuthUser | IErrorResponse> {
            const timeStampCurrent = UtilInstance.getDateCurrentForSQL()
            const queryData = {
                  name: 'reset-password-user',
                  text: `UPDATE ${Constants.tbl_usuario_sql} SET
                        password = $1,
                        fecha_ultimo_cambio = $2, 
                        idusuario = $3
                        WHERE id = $4 AND estado >= $5 RETURNING *`,
                  values: [   password, 
                              timeStampCurrent, 
                              idUserLogin,
                              id,
                              filterStatus
                        ]
            }

            let lData: Array<IAuthUser | IErrorResponse> = (await this.client.exeQuery(queryData)) as Array<IAuthUser | IErrorResponse>

            return lData[0]
      }

      /**
       * Metodo que permite cambiar la contraseña de acceso al sistema
       * @param id 
       * @param passwordCurrent 
       * @param passwordNew 
       * @param idUserLogin 
       * @returns 
       */
      async changePassword(id: BigInt, passwordCurrent: string, passwordNew: string, idUserLogin: BigInt): Promise<IAuthUser | IErrorResponse> {
            const timeStampCurrent = UtilInstance.getDateCurrentForSQL()
            const queryData = {
                  name: 'change-password-user',
                  text: `UPDATE ${Constants.tbl_usuario_sql} SET
                        password = $1,
                        fecha_ultimo_cambio = $2, 
                        idusuario = $3
                        WHERE id = $4 AND password LIKE $5 RETURNING *`,
                  values: [   passwordNew, 
                              timeStampCurrent, 
                              idUserLogin,
                              id,
                              passwordCurrent
                        ]
            }

            let lData: Array<IAuthUser | IErrorResponse> = (await this.client.exeQuery(queryData)) as Array<IAuthUser | IErrorResponse>

            // Si no coincide el password actual, genera un error
            if( !lData || (lData && lData.length === 0) ) {
                  let error: IErrorResponse = { error: 'Error, integridad de datos', data:[] }
                  error.data?.push( {   type: Constants.error_type_custom as ErrorFieldType,
                        code: '', 
                        field:'password-current',
                        label: 'Contraseña actual', 
                        msg: 'El campo password actual es erroneo!' } 
                  )
                  return error
            }

            return lData[0]
      }
}

export default AuthUserDataAccess
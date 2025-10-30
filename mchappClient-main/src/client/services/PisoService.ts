import { IPiso } from "../models/IPiso"
import { DN_ALL_APARTMENTS_BY_USER_PATH, DN_APARTMENT_PATH } from "../helpers/constants";
import { deleteRequest, getRequest, patchRequest, postRequest } from "../helpers/Util"
import { RequestErrorHandler } from '../types/globalTypes'

class PisoService {
      async getAll(path: string = DN_APARTMENT_PATH): Promise<Array<IPiso> | undefined> {
            try {
                  let _result = await getRequest(`${path}`)
                  if (!_result) return undefined
                  return _result.data.data as Array<IPiso>
            } catch (err) {
                  console.log('Error al retornar datos DB!')
            }
            return undefined
      }

      async getAllByUser(id: BigInt): Promise<Array<IPiso> | undefined> {
            try {
                  let _result = await getRequest(`${DN_ALL_APARTMENTS_BY_USER_PATH}${id}/apartments`)
                  if (!_result) return undefined
                  return _result.data.data as Array<IPiso>
            } catch (err) {
                  console.log('Error al retornar datos DB!')
            }
            return undefined
      }

      async getById(id: BigInt): Promise<IPiso | undefined> {
            try {
                  let _result = await getRequest(`${DN_APARTMENT_PATH}${id}`)
                  if (!_result) return undefined
                  return _result.data.data as IPiso
            } catch (err) {
                  console.log('Error al retornar datos DB!')
            }
            return undefined
      }

      async update(data: IPiso, handleError?: RequestErrorHandler): Promise<IPiso | undefined> {
            try {
                  let _result = await patchRequest(`${DN_APARTMENT_PATH}${data.id!}`, data, null, handleError)
                  if (!_result) return undefined
                  return _result.data.data as IPiso
            } catch (err) {
                  console.log('Error al retornar datos DB!')
            }
            return undefined
      }

      async create(path: string, data: IPiso, handleError?: RequestErrorHandler): Promise<IPiso | undefined> {
            try {
                  data.id = undefined
                  let _result = await postRequest(`${path}`, data, null, handleError)
                  if (!_result) return undefined
                  return _result.data.data as IPiso
            } catch (err) {
                  console.log('Error al retornar datos DB!')
            }
            return undefined
      }

      async delete(path: string, id: BigInt, handleError?: RequestErrorHandler): Promise<IPiso | undefined> {
            try {
                  let _result = await deleteRequest(`${path}${id}`, null, handleError)
                  if (!_result) return undefined
                  return _result.data.data as IPiso
            } catch (err) {
                  console.log('Error al retornar datos DB!')
            }
            return undefined
      }
}

const PisoServiceInstance = new PisoService()
Object.freeze(PisoServiceInstance)

export default PisoServiceInstance
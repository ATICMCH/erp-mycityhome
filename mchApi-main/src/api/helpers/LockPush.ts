import DeviceBusiness from '@/api/business/DeviceBusiness'
import UtilInstance from '@/api/helpers/Util'
import axios from 'axios'

class LockPush {
    constructor() {}

    /**
     * Intento de push del código al dispositivo tipo Lock (TTLock/WeLock).
     * Si no hay configuración de TTLock, se limita a dejar un log.
     */
    async pushCodeToLock(opts: { idDevice: number, idApartment?: number, code: string }) {
        try {
            const { idDevice, code } = opts
            console.log('[LockPush] pushCodeToLock -> device:', idDevice, 'code:', code)

            // Obtener datos del dispositivo
            const deviceBusiness = new DeviceBusiness(BigInt(1), 1, false)
            const deviceDB = await deviceBusiness.getById(BigInt(idDevice))
            if (!deviceDB || (deviceDB as any).error) {
                console.log('[LockPush] Device not found in DB for id:', idDevice)
                return { pushed: false, reason: 'device_not_found' }
            }

            const device: any = deviceDB

            // Detectar si es TTLock / external lock
            const deviceType = (device.type || device.tdevice || '').toString().toLowerCase()
            if (!deviceType.includes('ttlock') && !deviceType.includes('lock') && !deviceType.includes('welock')) {
                console.log('[LockPush] Device type not supported for push:', deviceType)
                return { pushed: false, reason: 'unsupported_device_type', deviceType }
            }

            // Necesitamos identificador del lock en la nube (lockId / mac / serial)
            const info = device.info_extra || {}
            const lockId = info.lockId || info.lock_id || device.codigo || device.ref_dispositivo || null
            if (!lockId) {
                console.log('[LockPush] No lock identifier found on device.info_extra or device.codigo')
                return { pushed: false, reason: 'no_lock_identifier' }
            }

            // Comprobar variables de entorno para integración TTLock
            const TT_CLIENT_ID = process.env.TTLOCK_CLIENT_ID || ''
            const TT_CLIENT_SECRET = process.env.TTLOCK_CLIENT_SECRET || ''
            if (!TT_CLIENT_ID || !TT_CLIENT_SECRET) {
                console.log('[LockPush] TTLock credentials are not configured. Set TTLOCK_CLIENT_ID and TTLOCK_CLIENT_SECRET')
                return { pushed: false, reason: 'no_credentials' }
            }

            // Placeholder: aquí deberíamos implementar el flujo de autenticación y la llamada a la API TTLock
            // Para no enviar peticiones inesperadas, hacemos un log detallado y retornamos un status indicando que
            // falta completar la integración con las credenciales y los endpoints de TTLock.
            console.log('[LockPush] Credentials present. To complete integration: implement TTLock OAuth + addPass API call')
            console.log('[LockPush] Would push to lockId:', lockId, 'with code:', code)

            // Ejemplo (no funcional) de cómo sería una llamada POST (descomentar y completar cuando se tenga API):
            // const token = await this.getTTLockToken(TT_CLIENT_ID, TT_CLIENT_SECRET)
            // await axios.post('https://api-ttlock.example/lock/addPassword', { lockId, password: code, pwdType: 1 }, { headers: { Authorization: `Bearer ${token}` } })

            return { pushed: false, reason: 'not_implemented', info: { lockId } }
        } catch (err) {
            console.error('[LockPush] Exception:', err)
            return { pushed: false, reason: 'exception', error: err }
        }
    }

    // Implementación futura: obtener token de TTLock
    async getTTLockToken(clientId: string, clientSecret: string) {
        // TODO: Implementar OAuth 2.0 con TTLock y devolver access_token
        return null
    }
}

const LockPushInstance = new LockPush()
Object.freeze(LockPushInstance)

export default LockPushInstance

import DeviceBusiness from '../business/DeviceBusiness'
import UtilInstance from './Util'
import ParametrosGeneralesBusiness from '../business/ParametrosGeneralesBusiness'
import EWeLinkInstance from './EWeLink'
import Constants from './Constants'
import axios from 'axios'

class LockPush {
    constructor() {}

    /**
     * Intento de push del código al dispositivo tipo Lock (TTLock/WeLock).
     */
    async pushCodeToLock(opts: { idDevice: number, idApartment?: number, code: string }) {
        try {
            const { idDevice, code } = opts
            console.log('[LockPush] pushCodeToLock -> device:', idDevice, 'code:', code)

            // 1. Obtener datos del dispositivo
            const deviceBusiness = new DeviceBusiness(BigInt(1), 1, false)
            const deviceDB = await deviceBusiness.getById(BigInt(idDevice))
            if (!deviceDB || (deviceDB as any).error) {
                console.log('[LockPush] Dispositivo no encontrado en BD:', idDevice)
                return { pushed: false, reason: 'device_not_found' }
            }

            const device: any = deviceDB
            const deviceType = (device.type || device.tdevice || '').toString().toLowerCase()

            // Manejo para dispositivos Sonoff / eWeLink
            if (deviceType.includes(Constants.type_device_sonoff) || deviceType.includes('sonoff')) {
                console.log('[LockPush] Detected eWeLink/Sonoff device, attempting eWeLink push')
                const paramBus = new ParametrosGeneralesBusiness(BigInt(1), 1, false)
                const tokenParam: any = await paramBus.getByCode('TOKEN-EWELINK')
                if ((tokenParam as any).error) {
                    console.log('[LockPush] No eWeLink token found in parametros generales')
                    return { pushed: false, reason: 'no_ewelink_token' }
                }

                const token = (tokenParam && tokenParam.data && tokenParam.data.data && tokenParam.data.data.accessToken) ? tokenParam.data.data.accessToken : tokenParam.valor
                const idDeviceEwe = device.codigo || (device.info_extra && (device.info_extra.deviceid || device.info_extra.deviceId)) || null
                if (!idDeviceEwe) {
                    console.log('[LockPush] No eWeLink device identifier found on device.codigo or device.info_extra')
                    return { pushed: false, reason: 'no_ewelink_deviceid' }
                }

                try {
                    const res = await EWeLinkInstance.setStatus(token, idDeviceEwe.toString())
                    console.log('[LockPush] eWeLink result:', res)
                    const pushed = (res && (res as any).error === 0) ? true : false
                    return { pushed, reason: pushed ? 'ok' : 'ewelink_error', info: res }
                } catch (err) {
                    console.error('[LockPush] Error pushing to eWeLink:', err)
                    return { pushed: false, reason: 'exception', error: err }
                }
            }

            if (deviceType.includes(Constants.type_device_sonoff) || deviceType.includes('sonoff')) {
                console.log('[LockPush] Detectado dispositivo eWeLink, intentando push')
                const paramBus = new ParametrosGeneralesBusiness(BigInt(1), 1, false)
                const tokenParam: any = await paramBus.getByCode('TOKEN-EWELINK')
                if ((tokenParam as any).error) {
                    return { pushed: false, reason: 'no_ewelink_token' }
                }

                const token = (tokenParam && tokenParam.data && tokenParam.data.data && tokenParam.data.data.accessToken) ? tokenParam.data.data.accessToken : tokenParam.valor
                const idDeviceEwe = device.codigo || (device.info_extra && (device.info_extra.deviceid || device.info_extra.deviceId)) || null
                if (!idDeviceEwe) {
                    return { pushed: false, reason: 'no_ewelink_deviceid' }
                }

                try {
                    const res = await EWeLinkInstance.setStatus(token, idDeviceEwe.toString())
                    const pushed = (res && (res as any).error === 0) ? true : false
                    return { pushed, reason: pushed ? 'ok' : 'ewelink_error', info: res }
                } catch (err) {
                    return { pushed: false, reason: 'exception', error: err }
                }
            }

            // ---------------------------------------------------------
            // MANEJO TTLOCK / WELOCK (CERRADURAS) - NUEVA INTEGRACIÓN
            // ---------------------------------------------------------
            if (!deviceType.includes('ttlock') && !deviceType.includes('lock') && !deviceType.includes('welock')) {
                console.log('[LockPush] Tipo de dispositivo no soportado:', deviceType)
                return { pushed: false, reason: 'unsupported_device_type', deviceType }
            }

            // A. Extraer el Lock ID de la base de datos (El ID interno de la cerradura en los servidores de WeLock)
            const info = device.info_extra || {}
            const lockId = info.lockId || info.lock_id || device.codigo || device.ref_dispositivo || null
            if (!lockId) {
                console.log('[LockPush] No hay identificador de cerradura (lockId/codigo).')
                return { pushed: false, reason: 'no_lock_identifier' }
            }

            // B. Traer las credenciales de entorno del servidor
            const TT_CLIENT_ID = process.env.TTLOCK_CLIENT_ID || ''
            const TT_CLIENT_SECRET = process.env.TTLOCK_CLIENT_SECRET || ''
            const TT_USERNAME = process.env.TTLOCK_USERNAME || '' 
            const TT_PASSWORD = process.env.TTLOCK_PASSWORD || '' // Debe estar en formato MD5
            const TT_API_URL = process.env.TTLOCK_API_URL || 'https://euapi.ttlock.com' // Servidor Europeo

            if (!TT_CLIENT_ID || !TT_CLIENT_SECRET || !TT_USERNAME || !TT_PASSWORD) {
                console.log('[LockPush] Faltan variables de entorno TTLOCK en el archivo .env')
                return { pushed: false, reason: 'no_credentials' }
            }

            // C. Autenticarse y conseguir el Access Token
            let accessToken = null;
            try {
                const tokenResponse = await axios.post(`${TT_API_URL}/oauth2/token`, null, {
                    params: {
                        clientId: TT_CLIENT_ID,
                        clientSecret: TT_CLIENT_SECRET,
                        username: TT_USERNAME,
                        password: TT_PASSWORD, 
                        grant_type: 'password'
                    }
                });
                accessToken = tokenResponse.data.access_token;
            } catch (authError) {
                console.error('[LockPush] Error en la autenticación con TTLock/WeLock.')
                return { pushed: false, reason: 'auth_error' }
            }

            if (!accessToken) {
                return { pushed: false, reason: 'no_access_token' }
            }

            // D. Enviar el código a la cerradura
            console.log(`[LockPush] Token obtenido. Añadiendo código ${code} a la cerradura ${lockId}...`)
            
            const startDate = new Date().getTime();
            const endDate = startDate + (365 * 24 * 60 * 60 * 1000); // Válido por 1 año por defecto

            try {
                const pwdResponse = await axios.post(`${TT_API_URL}/v3/keyboardPwd/add`, null, {
                    params: {
                        clientId: TT_CLIENT_ID,
                        accessToken: accessToken,
                        lockId: lockId,
                        keyboardPwd: code,
                        keyboardPwdName: 'ERP_Codigo_' + code, // Nombre que se verá en la App
                        startDate: startDate,
                        endDate: endDate,
                        addType: 2, // 2 = Contraseña Personalizada
                        date: new Date().getTime()
                    }
                });

                const pwdResult = pwdResponse.data;
                console.log('[LockPush] Respuesta API WeLock:', pwdResult);

                if (pwdResult && pwdResult.errcode === 0) {
                    console.log(`[LockPush] ¡Éxito! Código ${code} asignado a la puerta.`)
                    return { pushed: true, reason: 'ok', info: pwdResult }
                } else {
                    console.error(`[LockPush] WeLock rechazó la orden. Razón: ${pwdResult.errmsg}`)
                    return { pushed: false, reason: 'api_error', info: pwdResult }
                }

            } catch (pwdError) {
                console.error('[LockPush] Error de red enviando código a WeLock:', pwdError)
                return { pushed: false, reason: 'api_request_failed' }
            }

        } catch (err) {
            console.error('[LockPush] Exception general:', err)
            return { pushed: false, reason: 'exception', error: err }
        }
    }
}

const LockPushInstance = new LockPush()
Object.freeze(LockPushInstance)

export default LockPushInstance
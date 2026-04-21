const fetch = require('node-fetch');
const ApiConfigurationInstance = require('./ApiConfiguration');

class EWeLinkService {
      async getStatusByIdDevice(idDevice) {
            let endPointApi = `${ApiConfigurationInstance.pathApi}/api/public/devices/${idDevice}/sonoff/status`

            if ( !endPointApi ) return []
            let dataResult = { data: [] }
            try {
                  console.log('🟦 [EWeLinkService] GET', endPointApi)
                  const res = await fetch(endPointApi)
                  console.log('🟦 [EWeLinkService] GET status:', res.status)
                  const text = await res.text()
                  try {
                        const json = JSON.parse(text)
                        console.log('🟦 [EWeLinkService] GET body JSON:', json)
                        if (res.status === 200) dataResult = json
                  } catch (parseErr) {
                        console.log('🟦 [EWeLinkService] GET body (non-json):', text)
                  }
            } catch(err) {
                  console.log('🔴 [EWeLinkService] GET Error https on API:', err)
            }
            
            return dataResult
      }

      async setStatusByIdDevice(idDevice) {
            let endPointApi = `${ApiConfigurationInstance.pathApi}/api/public/devices/${idDevice}/sonoff/status`

            if ( !endPointApi ) return []
            let dataResult = { data: [] }
            try {
                  console.log('🟦 [EWeLinkService] POST', endPointApi)
                  const res = await fetch( endPointApi,{
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json'}
                  })
                  console.log('🟦 [EWeLinkService] POST status:', res.status)
                  const text = await res.text()
                  try {
                        const json = JSON.parse(text)
                        console.log('🟦 [EWeLinkService] POST body JSON:', json)
                        if (res.status === 200) dataResult = json
                  } catch (parseErr) {
                        console.log('🟦 [EWeLinkService] POST body (non-json):', text)
                  }
            } catch(err) {
                  console.log('🔴 [EWeLinkService] POST Error https on API:', err)
            }
            
            return dataResult
      }
}

const EWeLinkServiceInstance = new EWeLinkService()
Object.freeze(EWeLinkServiceInstance)

module.exports = EWeLinkServiceInstance
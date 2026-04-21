import ValidationsInstance from "./Validations"

class UtilCustom {
      constructor() {}

      /**
       * Obtiene la fecha actual en formato: DAY/MONTH/YEAR HH:MM:SS. [27/01/2023 17:50:33]
       * @param dCurrent 
       * @returns 
       */
      getDateCurrentString( dCurrent = new Date() ): string {
            try {
                return new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'Europe/Madrid' }).format(dCurrent)
            } catch(err){
                return new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'Europe/Madrid' }).format(new Date())
            }
      }

      /**
       * Obtiene la fecha actual en formato 'YEAR-MOTH-DAY HH-MM-SS' [2023-01-27 09:50:00] para POSTGRESSQL
       * @returns {fecha: 2023-01-27, hora: 09:50:00}
       */
      getDateCurrent(): {fecha: string, hora: string} {
            let [dateCurrent, timeCurrent] = (this.getDateCurrentString().trim()).split(',').map(el => el.trim())
            let [dayCurrent, monthCurrent, yearCurrent] = dateCurrent.split('/')
            return {fecha: `${yearCurrent}-${monthCurrent}-${dayCurrent}`, hora: `${timeCurrent}`}
      }

      getDateNextStep( fecha: string ): { fecha: string } {
            let _currentFecha = new Date()
            let _fecha = ( ValidationsInstance.checkFormatDateSQL(fecha) ) ? new Date(fecha) : _currentFecha
            _fecha = ( _fecha.getTime() < _currentFecha.getTime() ) ? _currentFecha : _fecha
            let _fechaResult = new Date(_fecha.getTime()+(86400000*5))
            // 0 -> domingo, 6 -> sabado
            const addDays = _fechaResult.getDay() === 0 ? 86400000 : ( _fechaResult.getDay() === 6 ? -86400000: 0 )
            _fechaResult = new Date(_fechaResult.getTime() + addDays)

            let [dateCurrent] = (this.getDateCurrentString(_fechaResult).trim()).split(',').map(el => el.trim())
            let [dayCurrent, monthCurrent, yearCurrent] = dateCurrent.split('/')

            return {fecha: `${yearCurrent}-${monthCurrent}-${dayCurrent}`}
      }

      actionAddAndDismissDays( fecha: string, days: number ): { fecha: string } {
            let _currentFecha = new Date()
            let _fecha = ( ValidationsInstance.checkFormatDateSQL(fecha) ) ? new Date(fecha) : _currentFecha
            let _fechaResult = new Date(_fecha.getTime()+(86400000*days))

            let [dateCurrent] = (this.getDateCurrentString(_fechaResult).trim()).split(',').map(el => el.trim())
            let [dayCurrent, monthCurrent, yearCurrent] = dateCurrent.split('/')

            // console.log(`${yearCurrent}-${monthCurrent}-${dayCurrent}`)

            return {fecha: `${yearCurrent}-${monthCurrent}-${dayCurrent}`}
      }

      /**
       * Formato de fecha entrada: 2023-09-01
       * @param fecha 
       * @returns [DD/<ene/feb...>/YYYY]
       */
      toFormatSanDiego( fecha: string ): { fecha: string } {
            if ( !fecha ) return { fecha: 'YYYY-MM-DD'}
            let [yearCurrent, monthCurrent, dayCurrent] = fecha.split('-')
            const _formatSanDiego = ['','ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

            return { fecha: `${dayCurrent}/${_formatSanDiego[parseInt(monthCurrent)]}/${yearCurrent}` }
      }

      /**
       * Retorna la diferencia [horas, minutos] entre dos fechas
       * @param dateStart [YYYY-MM-DD HH:MM:SS] 24H
       * @param dateEnd [YYYY-MM-DD HH:MM:SS] 24H
       * @returns 
       */
      getHoursMinDiff( dateStart: string, dateEnd: string) : {h: number, m: number} {
            let _result = {h: 0, m: 0}
            try {
                  let _diffTimestampt = ((Date.parse(dateEnd) - Date.parse(dateStart))/1000) || 0
                  if (_diffTimestampt < 0) throw 'Error'
                  _result.h = parseInt(Math.floor(_diffTimestampt/3600).toFixed())
                  _result.m = parseInt(Math.floor((_diffTimestampt/60) % 60).toFixed())
            }catch(e){}

            return _result
      }

      getLabelTypeDevice(code: string): string {
            switch(code){
                  case 'lock':
                        return 'Manija'
                  case 'ttlock':
                        return 'Manija TTLock'
                  case 'telefonillo':
                        return 'Telefonillo'
                  case 'movil':
                        return 'Móvil'
                  case 'router':
                        return 'Router'
                  case 'sonoff':
                        return 'Luces'
                  case 'camara':
                        return 'Cámara'
                  default:
                        return 'Desconocido'
            }
      }

      getLabelRoleMultiLogin(code: string): string {
            switch(code){
                  case 'crm':
                        return 'CRM'
                  case 'rmg':
                        return 'RMG'
                  case 'ade':
                        return 'ADE'
                  case 'da':
                        return 'DA'
                  case 'dnmaster':
                        return 'DN'
                  case 'dn':
                        return 'DN'
                  case 'rrhhmaster':
                        return 'RRHH'
                  case 'rrhh':
                        return 'MBE'
                  case 'atic':
                        return 'ATIC'
                  case 'colaborador':
                        return 'Agente'
                  case 'superadmin':
                        return 'SuperAdmin'
                  case 'admin':
                        return 'Admin'
                  case 'ceo':
                        return 'CEO'
                  case 'crmmaster':
                        return 'CRM'
                  case 'aticmaster':
                        return 'ATIC'
                  case 'rmgmaster':
                        return 'RMG'
                  case 'damaster':
                        return 'DA'
                  case 'ademaster':
                        return 'ADE'
                  default:
                        return 'DES'
            }
      }

      /**
       * Metodo que calcula el numero de: dias, meses y años entre dos fechas
       * @param dateIni Fecha inicial 
       * @param dateEnd Fecha final
       * @returns {dias: string, meses: string, anos: string}
       */
      dateCalculator(dateIni: string, dateEnd: string):{dias: string, meses: string, anos: string}{
       let totalMilisegundos = 0
        let horas = 0
        let dias = 0
        let meses = 0
        let anos = 0

      

        //console.log(dateEnd,dateIni)

        //Validamos (falta validar tipo fecha) y comprobamos que el data opuesto este añadido y procedemos a realizar el cálculo


            totalMilisegundos = ((Date.parse(dateEnd as string))-(Date.parse(dateIni as string)))/1000
            horas = parseInt(Math.floor(totalMilisegundos/3600).toFixed())
            dias = horas/24
            meses = parseInt(Math.floor(dias/((28+29+30+31)/4)).toFixed())
            anos = parseInt(Math.floor(meses/12).toFixed())



        return {dias:`${dias}`, meses: `${meses}`, anos: `${anos}`}
      }
  /**
       * Obtiene la fecha con su respectivo timestamp
       * @param fecha string [YEAR-MOTH-DAY]
       * @param hora string [HH-MM-SS]
       * @returns {fecha: 2023-01-27, hora: 09:50:00, timestamp: 454345987}
       */
  getDateCustom(fecha: string, hora: string): {fecha: string, hora: string, timestamp: number} {
      return { fecha, hora, timestamp: (new Date(`${fecha} ${hora}`).getTime()/1000) }
}
      /**
      
       

       * Recupera el lbl de los estados
       * @param code 
       * @returns 
       */
      getLabelEstadoRMG(code: number): string {
            let _lblStatus = ''
            switch (code) {
                  case 1:
                      _lblStatus = 'Activo'
                      break
                  case 2: 
                      _lblStatus = 'Stop Sell'
                      break
                  case 3: 
                      _lblStatus = 'No disponible'
                      break
                  case 4: 
                      _lblStatus = 'Solo CE'
                      break
                  case 5: 
                      _lblStatus = 'Solo LE'
                      break
                  case 6: 
                      _lblStatus = 'Sale de LE'
                      break
                  case 7: 
                      _lblStatus = 'Entra a LE'
                      break
                  default:
                      _lblStatus = '---'
            }
            return _lblStatus

      }
}

const UtilCustomInstance = new UtilCustom()
Object.freeze(UtilCustomInstance)

export default UtilCustomInstance

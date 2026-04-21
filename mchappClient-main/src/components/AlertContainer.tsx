import { ALERT_DANGER, ALERT_INFO, ALERT_SUCCESS, ALERT_WARNING, ALERT_DARK } from "@/client/helpers/constants"
import { tAlert } from "@/client/types/globalTypes"

const typeAlertL = [ALERT_INFO, ALERT_DANGER, ALERT_SUCCESS, ALERT_WARNING, ALERT_DARK]

const checkTypeAlert = (typeCode: tAlert): tAlert => {
    return typeAlertL.includes(typeCode || '') ? typeCode : ALERT_INFO as tAlert
}

const getColorAlert = (value: tAlert): string => {
    switch(value) {
        case ALERT_INFO:
            return 'blue'
        case ALERT_DANGER:
            return 'red'
        case ALERT_SUCCESS:
            return 'green'
        case ALERT_WARNING:
            return 'yellow'
        case ALERT_DARK:
            return 'dark'
        default:
            return 'blue'
    }
}

const AlertContainer = ( { typeAlert, children } : {typeAlert:tAlert, children: any} ) => {
    const _typeAlert: tAlert =  checkTypeAlert(typeAlert as tAlert)
    const _classAlert = getColorAlert(_typeAlert)

    return (
        <div className={`border-black bg-red-100 flex p-4 mb-4 text-sm text-${_classAlert}-800 border border-${_classAlert}-300 rounded-lg bg-${_classAlert}-50 dark:text-${_classAlert}-400 dark:border-${_classAlert}-800`}  role="alert">
            <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
            <span className="sr-only">Info</span>
            <div>
                { children }
            </div>
        </div>
    )
}

export default AlertContainer
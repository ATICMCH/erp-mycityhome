import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import { ISolicitudPrecio } from '@/client/models/ISolicitudPrecio'

const useLimitePrecioId = () => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)

    const [dataDB, setDataDB] = useState<ISolicitudPrecio>({
        id: 0,
        limite_precio: 0,
        porcentaje_limite_precio: 0,
        f_fecha_creacion: '',
        lbl_estado_solicitud: '',
        propietario: '',
        piso: '',
        observacion: ''
    })
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    const handleChange = (e: any) => {
        let _val = e.target.value
        let _name = e.target.name as string

        setDataDB({
            ...dataDB,
            [_name]: _val
        })
    }

    const handleSave = async (action: string) => {
        setErrorValidate(() => false)
        const result = await ( id ?
            FetchApiServiceInstance.update(`/api/rmg/limiteprecio/${id!}/${action}`, { ...dataDB }, (err) => {
                // Se ejecuta para status diferente de 200
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string, label?: string}> }
                    if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => {
                        return `${el.label || ''}: ${el.msg}`
                    })))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                }
            }) : undefined
        )

        // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            router.push('/rmg/limiteprecio/')
        }
    }

    useEffect(() => {
        let statusDataId = 200
        id && FetchApiServiceInstance.getSingleData(`/api/rmg/limiteprecio/${id}`, (err) => {
            const { status } = err.response!
            statusDataId = status
        }).then( data => {
            // Preprocesar data y cambiar de null a vacío, para evitar warnings React
            if ( statusDataId === 200 && data ) {
                let _data = data as ISolicitudPrecio
                setDataDB( {    ..._data,
                    observacion: _data.observacion || ''
                })
            }
        }).catch(err => {}).finally(()=>{})
    }, [id])

    return {
        dataDB,
        handleChange,
        handleSave,
        handleCancel: () => handleCancel('/rmg/limiteprecio/', router),
        errorValidate,
        msgError
    }
}

export default useLimitePrecioId;
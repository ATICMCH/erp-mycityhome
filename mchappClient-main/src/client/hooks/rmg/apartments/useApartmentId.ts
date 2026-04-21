import { animateScroll as scroll} from 'react-scroll'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE, ALERT_MSG_SAVE_DATA, RMG_APARTMENT_PATH, SHARE_PLATAFORMA_PATH } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import { IInfoPisoComercial } from '@/client/models/IInfoPisoComercial'
import { IPlataformaComercial } from '@/client/models/IPlataformaComercial'
import ValidationsInstance from '@/client/helpers/Validations'

// Constants
const dataControl = {
    pais: { label: 'Pais', required: true, isError: false, msgDefault: 'Campo requerido' },
    ciudad: { label: 'Ciudad', required: true, isError: false },
    codigo_postal: { label: 'Código Postal', required: true, isError: false },
    direccion: { label: 'Dirección', required: true, isError: false },
    nro_edificio: { label: 'Nro Edificio', required: true, isError: false },
    nro_piso: { label: 'Nro Piso', required: false, isError: false },
    id_dispositivo_ref: { label: 'Código', required: true, isError: false }
}

const useApartmentId = () => {
    const router = useRouter()
    let id = BigInt((router.query.id as string) || 0)

    const [dataDB, setDataDB] = useState<IInfoPisoComercial>({
        id: 0,
        nombre_comercial: '',
        link_nombre_comercial: '',
        estado_general: 0,
        link_tour_virtual: '',
        link_calendario_disponibilidad: '',
        link_repositorio: '',
        tiene_anuncio: false,
        anuncio_usuario: '',
        anuncio_contrasenia: '',
        anuncio_plataforma: '',
        anuncio_link: '',
        idpiso: 0,
        a_etiqueta: '',
        a_localidad: '',
        a_codigo_postal: '',
        a_full_direccion: '',
        etiqueta: '', // Añadir esta propiedad faltante
        ciudad: '', // Añadir esta propiedad faltante
        l_idplataforma: 0,
        l_link: '',
        plataformas: [],
        variablesreserva: []
    })

    const [listPlataforma, setListPlataforma] = useState<Array<{ key:string, name: string }>>([])
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    const handleChange = (e: any) => {
        const _val = ( e.target.name === 'tiene_anuncio' ) ? (e.target.value === 'Si' ? true : false) : e.target.value
        setDataDB({
            ...dataDB,
            [e.target.name]: _val
        })
    }

    const handleAddPlataforma = () => {
        let _existPlataforma = dataDB.plataformas.findIndex(el => el.id.toString().trim() === dataDB.l_idplataforma?.toString())
        if ( _existPlataforma !== -1 ) {
            alert('Ya existe la plataforma!!')
            return
        }
        if (    dataDB.l_idplataforma && 
                dataDB.l_link && 
                dataDB.l_idplataforma != 0 && 
                dataDB.l_idplataforma != -2 &&
                dataDB.l_link !== '' && ValidationsInstance.checkUrl(dataDB.l_link!.trim()) ) {
            setDataDB((dCurrent) => {
                const _elPlataforma = listPlataforma.filter(el => el.key == dataDB.l_idplataforma?.toString())[0]
                const _namePlataforma = _elPlataforma?.name
                let __existPlataforma = dCurrent.plataformas.findIndex(el => el.id.toString().trim() === dataDB.l_idplataforma?.toString())
                if ( __existPlataforma === -1 ) dCurrent.plataformas.push( {id: parseInt(dCurrent.l_idplataforma!.toString()), nombre: _namePlataforma, link: dCurrent.l_link!.trim(), codigo: ''} )
                return {...dCurrent, l_idplataforma: -2, l_link: ''}
            })
        }
    }

    const handleDeletePlataforma = (valueRow: string) => {
        setDataDB((dCurrent) => {
            return { ...dCurrent, plataformas: dCurrent.plataformas.filter(el => el.id.toString() !== valueRow.trim())}
        })
    }

    const handleSave = async() => {
        setErrorValidate(() => false)

        // Validacion previa para el formulario
        // let {error, data} = MyLeadValidationInstance.validateSave(dataDB)
        // if ( error ) {
        //     setErrorValidate((previousValue) => !previousValue)
        //     setMsgError(detailsListAlert(MSG_ERROR_FIELD, data.map(el => el.label)))
        //     scroll.scrollToTop()
        //     return
        // }
        // return

        const result = await ( dataDB.id ?
            FetchApiServiceInstance.update(`${RMG_APARTMENT_PATH}${id}/infocomercial`, dataDB, (err) => {
                // Se ejecuta para status diferente de 200
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string}> }
                    if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => el.field)))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                }
            }) 
            :
            FetchApiServiceInstance.create(`${RMG_APARTMENT_PATH}${id}/infocomercial`, dataDB, (err) => {
                // Se ejecuta para status diferente de 200
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string}> }
                    if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => el.field)))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                }
            })
        )
        // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            router.push('/rmg/apartments/')
        } else scroll.scrollToTop()
    }

    useEffect(() => {
        setDataDB({...dataDB, idpiso: parseInt(id.toString())})
        let statusHttpIPC = 200
        let dataFilter = {  type_get_data: 'info_comercial' }
        FetchApiServiceInstance.getSingleDataWithFilter(`${RMG_APARTMENT_PATH}${id}/infocomercial`, dataFilter, (err) => {
            const { status } = err.response!
            statusHttpIPC = status
            console.log('Error, no hay datos!!')
        }).then( data => {
            // Preprocesar data y cambiar de null a vacío, para evitar warnings React
            if ( data && statusHttpIPC === 200 ) {
                let _data = data as IInfoPisoComercial
                console.log(_data)
                // setDataDB((el) => ({...el, ..._data}))
                setDataDB((el) => ({
                    ...el, // Mantiene todas las propiedades existentes
                    ..._data, // Sobrescribe con TODOS los datos de la API
                    l_idplataforma: 0,
                    l_link: '',
                    variablesreserva: []
                }))
            }
        }).catch(err => {}).finally(()=>{})

        // Get List: Plataforma
        let statusHttpPlataforma = 200
        FetchApiServiceInstance.getAllData(`${SHARE_PLATAFORMA_PATH}`, (err) => {
            const { status } = err.response!
            statusHttpPlataforma = status
        }).then( data => {
            if (statusHttpPlataforma === 200 && data) {
                let _data = (data as Array<IPlataformaComercial>)
                setListPlataforma( _data.map(el => ({ key: el.id.toString(), name: `${el.nombre}`})) )
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
    }, [id])

    return {
        dataDB,
        handleChange,
        handleSave,
        handleCancel: () => handleCancel('/rmg/apartments/', router),
        handleAddPlataforma,
        handleDeletePlataforma,
        errorValidate,
        msgError,
        dataControl,
        listPlataforma
    }
}

export default useApartmentId;
import { animateScroll as scroll} from 'react-scroll'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE, ALERT_MSG_SAVE_DATA, RMG_APARTMENT_PATH, SHARE_TIPOESTANCIA_PATH } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import { IInfoPisoComercial } from '@/client/models/IInfoPisoComercial'
import ValidationsInstance from '@/client/helpers/Validations'
import { IVariablesReserva } from '@/client/models/IVariablesReserva'
import { ITipoEstancia } from '@/client/models/ITipoEstancia'
import VariableReservaValidationInstance from '@/client/validations/VariableReservaValidation'

// Constants constantes 
const dataControl = {
    pais: { label: 'Pais', required: true, isError: false, msgDefault: 'Campo requerido' },
    ciudad: { label: 'Ciudad', required: true, isError: false },
    codigo_postal: { label: 'Código Postal', required: true, isError: false },
    direccion: { label: 'Dirección', required: true, isError: false },
    nro_edificio: { label: 'Nro Edificio', required: true, isError: false },
    nro_piso: { label: 'Nro Piso', required: false, isError: false },
    id_dispositivo_ref: { label: 'Código', required: true, isError: false }
}

const useApartmentIdConfigReserva = () => {
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

        etiqueta: '', // Added missing property pongo el comentario para evitar warning de React
        ciudad: '',   // Added missing property debería estar en el modelo IInfoPisoComercial

        l_idplataforma: 0,
        l_link: '',
        plataformas: [],

        vr_variablereserva: {
            id: 0,
            aplica: '-2',
            fecha_inicio_vigencia: '',
            fecha_fin_vigencia: '',
            estado: -2,
            precio_base: 0,
            porcentaje_descuento: 0,
            precio_alquiler: 0,
            precio_muebles: 0,
            total: 0,
            estancia_min: 0,
            estancia_max: 0,
            duracion_estancia: 0, 
            edad_min: 0,
            edad_max: 0,
            mascota: false,
            observacion: '',
            idinfopisocom: 0,
            idtipoestancia: -2,
            n_estancia: 'Na'
        } as IVariablesReserva,

        variablesreserva: []
    })

    const [listTipoEstancia, setListTipoEstancia] = useState<Array<{ key:string, name: string }>>([])
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    const handleChange = (e: any) => {
        const _isFieldReserva = (e.target.name as string).includes('vr_variablereserva')
        if ( _isFieldReserva ) {
            const [ name_obj, name_field ] = (e.target.name as string).split('.')
            let _val = e.target.value
            let _valFechaInicioVigencia = dataDB.vr_variablereserva?.fecha_inicio_vigencia
            let _valEstado = dataDB.vr_variablereserva?.estado
            let _valTotal = dataDB.vr_variablereserva?.total
            let _valDuracion = dataDB.vr_variablereserva?.duracion_estancia
            let _valNameEstancia = dataDB.vr_variablereserva?.n_estancia

            if ( name_field === 'mascota' ) {
                _val = e.target.value === 'Si' ? true : false
            } else if ( name_field === 'aplica' ) {
                _valFechaInicioVigencia = ''
                // aplica  [5: Ahora, 6: Despues] -> estado [2: Activo, 7: Pendiente]
                _valEstado = (e.target.value === 'Ahora')  ? 2 : (e.target.value === 'Despues') ? 7 : -2
            } else if ( name_field === 'precio_alquiler' ) {
                _valTotal = ( parseFloat(e.target.value) || 0 ) + ( parseFloat(dataDB.vr_variablereserva?.precio_muebles as any) || 0 )
            } else if (name_field === 'precio_muebles') {
                _valTotal = ( parseFloat(e.target.value) || 0 ) + ( parseFloat(dataDB.vr_variablereserva?.precio_alquiler as any) || 0 )
            } else if (name_field === 'idtipoestancia') {
                _valDuracion = 0
                const { name: __name = undefined } = listTipoEstancia.filter(el => el.key == e.target.value)[0] || {}
                _valNameEstancia = __name || 'Na'

            }

            setDataDB(dataCurrent => {
                return {    ...dataCurrent, 
                            vr_variablereserva: {
                                ...dataCurrent.vr_variablereserva,
                                estado: _valEstado,
                                fecha_inicio_vigencia: _valFechaInicioVigencia,
                                total: _valTotal,
                                duracion_estancia: _valDuracion,
                                n_estancia: _valNameEstancia,
                                [name_field]: _val
                            } as IVariablesReserva
                        }
            })
        } else {
            setDataDB({
                ...dataDB,
                [e.target.name]: e.target.value
            })
        }
    }

    const handleAddConfigReserva = () => {
        setErrorValidate(() => false)

        // Validacion previa para el formulario que se va a agregar
        // Validación de campos requeridos
        let {error, data} = VariableReservaValidationInstance.validateSave(dataDB.vr_variablereserva as IVariablesReserva)
        if ( error ) {
            setErrorValidate((previousValue) => !previousValue)
            setMsgError(detailsListAlert(MSG_ERROR_FIELD, data.map(el => el.label)))
            scroll.scrollToTop()
            return
        }

        const _tmpListVR = [ ...dataDB.variablesreserva ]
        console.log(_tmpListVR)
        if ( _tmpListVR.length === 2 ) {
            alert('Solo se pueden crear dos configuraciones de reserva [Ahora, Despues]')
            return
        } else if ( dataDB.vr_variablereserva?.aplica === 'Ahora' && _tmpListVR.filter(el => el.aplica == 'Ahora').length !== 0 ) {
            alert('Ya existe una configuración de tipo aplica: [Ahora]')
            return
        } else if ( dataDB.vr_variablereserva?.aplica === 'Despues' && _tmpListVR.filter(el => el.aplica == 'Despues').length !== 0 ) {
            alert('Ya existe una configuración de tipo aplica: [Despues]')
            return
        }

        const { id = undefined } = _tmpListVR.sort((a, b) => b.id-a.id)[0] || {} as IVariablesReserva
        const _dim = (id || 0) + 1
        setDataDB((dCurrent) => {
            let __existVarConfig = dCurrent.variablesreserva.findIndex(el => el.id === _dim)
            if ( __existVarConfig === -1 ) 
                dCurrent.variablesreserva.push( {   ...dCurrent.vr_variablereserva, 
                                                    id: _dim,
                                                    idinfopisocom: dCurrent.id,
                                                    delete(): void {
                                                        handleDeleteConfigReserva(this.id.toString())
                                                    } 
                                                } as IVariablesReserva )
            // console.log(dCurrent.variablesreserva)
            return { ...dCurrent, vr_variablereserva: {
                    id: 0,
                    aplica: '-2',
                    fecha_inicio_vigencia: '',
                    fecha_fin_vigencia: '',
                    estado: -2,
                    precio_base: 0,
                    porcentaje_descuento: 0,
                    precio_alquiler: 0,
                    precio_muebles: 0,
                    total: 0,
                    estancia_min: 0,
                    estancia_max: 0,
                    duracion_estancia: 0, 
                    edad_min: 0,
                    edad_max: 0,
                    mascota: false,
                    observacion: '',
                    idinfopisocom: 0,
                    idtipoestancia: -2,
                    n_estancia: 'Na'
                } as IVariablesReserva 
            }
        })
    }

    const handleDeleteConfigReserva = (valueRow: string) => {
        setDataDB((dCurrent) => {
            return { ...dCurrent, variablesreserva: dCurrent.variablesreserva.filter(el => el.id.toString() !== valueRow.trim())}
        })
    }

    const handleSave = async() => {
        setErrorValidate(() => false)

        // Validacion previa para el formulario
        // Only validation field [Estado general]
        let error: Array<{field: string, label: string, msg: string}> = []
        if ( !dataDB.estado_general || dataDB.estado_general.toString() === '' || dataDB.estado_general.toString() === '-2' ) 
            error.push({field: 'estado_general', label: 'Estado general', msg: 'Campo incorrecto!!'})
        
        if ( error.length > 0 ) {
            setErrorValidate((previousValue) => !previousValue)
            setMsgError(detailsListAlert(MSG_ERROR_FIELD, error.map(el => el.label)))
            scroll.scrollToTop()
            return
        }

        // Verifica que se agrege al menos una configuración ACTIVO
        if ( dataDB.variablesreserva.filter(el => el.aplica == 'Ahora').length === 0 ) {
            alert('Debe agregar por lo menos una configuración de tipo aplica: AHORA')
            return
        }

        const result = await ( dataDB.id ?
    FetchApiServiceInstance.update(`${RMG_APARTMENT_PATH}${id}/infocomercial/${dataDB.id}/variablesreserva`, dataDB, (err) => {
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
    ''
)

// Si no hay error, redirecciona [SOL TMP]
if ( result ) {
    alert(`${ALERT_MSG_SAVE_DATA}`)
    router.push('/rmg/apartments/')
} else scroll.scrollToTop()
    }

    useEffect(() => {
        setDataDB({...dataDB, idpiso: parseInt(id.toString())})
        let statusHttpIPC = 200
        let dataFilter = {  type_get_data: 'variables_reserva' }
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
                    ...el,     // 👈 MANTENER todas las propiedades existentes (etiqueta, ciudad, etc.)
                    ..._data   // 👈 SOBRESCRIBIR solo las que vienen en _data
                }))
            }
        }).catch(err => {}).finally(()=>{})

        // Get List: Tipo estancia
        let statusHttpTipoEstancia = 200
        FetchApiServiceInstance.getAllData(`${SHARE_TIPOESTANCIA_PATH}`, (err) => {
            const { status } = err.response!
            statusHttpTipoEstancia = status
        }).then( data => {
            if (statusHttpTipoEstancia === 200 && data) {
                let _data = (data as Array<ITipoEstancia>)
                setListTipoEstancia( _data.map(el => ({ key: el.id.toString(), name: `${el.nombre}`})) )
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
    }, [id])

return {
        dataDB,
        listTipoEstancia,
        errorValidate,
        msgError,
        handleChange,
        handleAddConfigReserva,
        handleDeleteConfigReserva,
        handleSave
    }
}

export default useApartmentIdConfigReserva
import { RMG_INFOCOMERCIAL_PATH, SHARE_PLATAFORMA_PATH } from '@/client/helpers/constants';
import { IPiso } from '@/client/models/IPiso';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import FetchApiServiceInstance from '@/client/services/FetchApiService';
import { IInfoPisoComercial } from '@/client/models/IInfoPisoComercial';
import { IVariablesReserva } from '@/client/models/IVariablesReserva';
import FilterInstance from '@/client/helpers/Filter';
import UtilCustomInstance from '@/client/helpers/UtilCustom';
import { IData } from '@/client/models/IData'

type filterSearchAll = {
    search_all: string,
    ds_nro_dormitorios: number,
    cp_ocupacion_maxima: number,
    ds_nro_camas: number,
    bs_nro_banios: number,
    total: number,
    total_start: number,
    total_end: number,
    estado_general: number,
    limit: number,
    offset: number
}

const limit = 50

const usePisoComercial = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<IInfoPisoComercial>>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState<number>(0)
    const [pageCurrent, setPageCurrent] = useState<number>(0)

    const [filterFields, setFilterFields] = useState<filterSearchAll>({
        search_all: '',
        ds_nro_dormitorios: -1,
        cp_ocupacion_maxima: -1,
        ds_nro_camas: -1,
        bs_nro_banios: -1,
        total: -1,
        total_start: -1,
        total_end: -1,
        estado_general: -2,
        limit: limit,
        offset: 0
        } as filterSearchAll)
    const [flagFilter, setFlagFilter] = useState<number>(0)

    const handlerOnPage = (e: any) => {
        setPageCurrent(e.selected)
        setFilterFields( (current) => ({...current, offset: (e.selected * limit) % total}) )
        setFlagFilter( (flagFilter) => { return flagFilter + 1 } )
        setLoading(true)
    }

    const handleActionSearch = () => {
        setFlagFilter((flagFilter) => { return flagFilter + 1 })
        setFilterFields((current) => ({...current, offset: 0}))
        setPageCurrent(0)
        FilterInstance.setPisoComercial(filterFields)
        setLoading(true)
    }

    useEffect(() => {
        if (flagFilter === 0) {
            return
        }
        
        let statusHttpUS = 200
        let dataFilter = {  search_all: filterFields.search_all.trim(), 
                            ds_nro_dormitorios: filterFields.ds_nro_dormitorios,
                            cp_ocupacion_maxima: filterFields.cp_ocupacion_maxima,
                            ds_nro_camas: filterFields.ds_nro_camas,
                            bs_nro_banios: filterFields.bs_nro_banios,
                            total: filterFields.total,
                            total_start: filterFields.total_start,
                            total_end: filterFields.total_end,
                            estado_general: filterFields.estado_general,
                            tipo: 'all_info_comercial'         
                        }
        
                        let _total = 0
                        FetchApiServiceInstance.getSingleDataWithFilter(`/api/share/data/totaldata/`, { ...dataFilter }, (err) => {
                            const { status } = err.response!
                            statusHttpUS = status
                        }).then( data => {
                            if ( statusHttpUS === 200 && data ) {
                                let _data = data as IData
                                setTotal(_data.total_data)
                                _total = _data.total_data
                                if (_total === 0) return
                
                                let _dataFilter = {
                                    search_all: filterFields.search_all.trim(),
                                    ds_nro_dormitorios: filterFields.ds_nro_dormitorios,
                                    cp_ocupacion_maxima: filterFields.cp_ocupacion_maxima,
                                    ds_nro_camas: filterFields.ds_nro_camas,
                                    bs_nro_banios: filterFields.bs_nro_banios,
                                    total: filterFields.total,
                                    total_start: filterFields.total_start,
                                    total_end: filterFields.total_end,
                                    estado_general: filterFields.estado_general,
                                    limit: filterFields.limit,
                                    offset: filterFields.offset
                                }
                                
                                // Consultar datos por paginación []
                                FetchApiServiceInstance.getAllWithFilter(`/api/rmg/p/apartments/`, { ..._dataFilter }, (err) => {
                                    const { status } = err.response!
                                    statusHttpUS = status
                                }).then( data => {
                                    if ( statusHttpUS === 200 && data ) {
                                        let _data = (data as Array<IInfoPisoComercial>)
                                        let _dList = [  ..._data.map(d => 
                                                {
                                                    let [ _palquiler, _pmuebles, _plimite ] = 
                                                                    d.variablesreserva.length === 0 ? 
                                                                        [ 0, 0, 0 ] 
                                                                        : 
                                                                        [   (d.variablesreserva[0].precio_alquiler)*1.0, 
                                                                            (d.variablesreserva[0].precio_muebles)*1.0,
                                                                            (d.variablesreserva[0].precio_limite)*1.0
                                                                        ]
                                                    let _totalMCH = ( _palquiler + _pmuebles ) * 0.85
                                                    return {    ...d,
                                                                estado_alquiler_rentable: ( _totalMCH === _plimite ) ? 'NA' : ( ( _totalMCH < _plimite ) ? 'NO' : 'SI' ),
                                                                vr_variablereserva: d.variablesreserva.length === 0 ? {} as IVariablesReserva : d.variablesreserva[0],
                                                                precio_alquiler_tooltip: d.variablesreserva.length === 0 ? 0 : d.variablesreserva[0].precio_alquiler,
                                                                precio_muebles_tooltip: d.variablesreserva.length === 0 ? 0 : d.variablesreserva[0].precio_muebles,
                                                                total_tootip: d.variablesreserva.length === 0 ? 0 : d.variablesreserva[0].total,
                                                                precio_limite_tooltip: d.variablesreserva.length === 0 ? 0 : d.variablesreserva[0].precio_limite,
                                                                lestado: UtilCustomInstance.getLabelEstadoRMG( (d.estado_general === undefined || d.estado_general === null) ? 0 : d.estado_general )
                                                            }
                                                }
                                            )
                                        ]
                                        setListData([ ..._dList ])
                                    }
                                }).catch(err => {
                                    console.log('err: ', err)
                                }).finally(()=>{
                                    setLoading(false)
                                })
                            }
                        }).catch(err => {
                            console.log('err: ', err)
                        }).finally(()=>{
                            if ( _total === 0 ) {
                                setLoading(false)
                                setListData([])
                            }
                        })
        
        // FetchApiServiceInstance.getAllWithFilter(RMG_INFOCOMERCIAL_PATH, { ...dataFilter }, (err) => {
        //     const { status } = err.response!
        //     statusHttpUS = status
        // }).then( data => {
        //     if ( statusHttpUS === 200 && data ) {
        //         let _data = (data as Array<IInfoPisoComercial>)
        //         let _dList = [  ..._data.map(d => 
        //                 {
        //                     let [ _palquiler, _pmuebles, _plimite ] = 
        //                                     d.variablesreserva.length === 0 ? 
        //                                         [ 0, 0, 0 ] 
        //                                         : 
        //                                         [   (d.variablesreserva[0].precio_alquiler)*1.0, 
        //                                             (d.variablesreserva[0].precio_muebles)*1.0,
        //                                             (d.variablesreserva[0].precio_limite)*1.0
        //                                         ]
        //                     let _totalMCH = ( _palquiler + _pmuebles ) * 0.85
        //                     return {    ...d,
        //                                 estado_alquiler_rentable: ( _totalMCH === _plimite ) ? 'NA' : ( ( _totalMCH < _plimite ) ? 'NO' : 'SI' ),
        //                                 vr_variablereserva: d.variablesreserva.length === 0 ? {} as IVariablesReserva : d.variablesreserva[0],
        //                                 precio_alquiler_tooltip: d.variablesreserva.length === 0 ? 0 : d.variablesreserva[0].precio_alquiler,
        //                                 precio_muebles_tooltip: d.variablesreserva.length === 0 ? 0 : d.variablesreserva[0].precio_muebles,
        //                                 total_tootip: d.variablesreserva.length === 0 ? 0 : d.variablesreserva[0].total,
        //                                 precio_limite_tooltip: d.variablesreserva.length === 0 ? 0 : d.variablesreserva[0].precio_limite,
        //                                 lestado: UtilCustomInstance.getLabelEstadoRMG( (d.estado_general === undefined || d.estado_general === null) ? 0 : d.estado_general )
        //                             }
        //                 }
        //             )
        //         ]
        //         setListData([ ..._dList ])
        //     } else {
        //         setListData([])
        //     }
        // }).catch(err => {
        //     console.log('err: ', err)
        // }).finally(()=>{
        //     setTimeout(() => setLoading(false), 200);
        // })
    }, [flagFilter])

    const changeSearch = (e: any) => {
        let _value = e.target.value
        if ( ['total', 'bs_nro_banios', 'ds_nro_camas', 'ds_nro_dormitorios', 'cp_ocupacion_maxima', 'total_start', 'total_end'].includes(e.target.name as string) ) {
            _value = parseInt(isNaN(e.target.value) ? -1 : e.target.value) < 0 ? -1 : e.target.value
        }
        
        setFilterFields({
            ...filterFields,
            [e.target.name]: _value
        })
        console.log(e.target.name)
        if ( e.target.name == 'estado_general' ) {
            setFlagFilter((flagFilter) => { return flagFilter + 1 })
            FilterInstance.setPisoComercial(filterFields)
            setLoading(true)
        }
    }

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            setFlagFilter((flagFilter) => { return flagFilter + 1 })
            setFilterFields((current) => ({...current, offset: 0}))
            setPageCurrent(0)
            FilterInstance.setPisoComercial(filterFields)
            setLoading(true)
        }
    }

    useEffect(() => {
        setFilterFields((current) => ({...current, ...FilterInstance.getPisoComercial()}))
        setFlagFilter((flagFilter) => { return flagFilter + 1 })
    }, [])

    /**
     * Capturar la position del mouse para reubicar 
     */
    useEffect(() => {
        const handleMouseMove = (event:any) => {
          console.log(`x: ${event.clientX}, y: ${event.clientY}`)
        }
    
        // window.addEventListener('mousemove', handleMouseMove);
    
        return () => {
          window.removeEventListener(
            'mousemove',
            handleMouseMove
          )
        }
    }, [])

    return {
        listData,
        loading,
        filterFields,
        total,
        pageCurrent,
        limit,
        changeSearch,
        handleKeyDown,
        handlerOnPage,
        handleActionSearch
    }
}

export default usePisoComercial;
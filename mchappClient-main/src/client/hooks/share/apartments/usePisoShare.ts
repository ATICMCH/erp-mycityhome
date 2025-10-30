import { SHARE_PISOS_PATH } from '@/client/helpers/constants';
import { IPiso } from '@/client/models/IPiso';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import FetchApiServiceInstance from '@/client/services/FetchApiService';
import FilterInstance from '@/client/helpers/Filter';
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
    limit: number,
    offset: number 
}

const limit = 50

const usePisoShare = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<IPiso>>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState<number>(0)
    const [pageCurrent, setPageCurrent] = useState<number>(0)

    const [filterFields, setFilterFields] = useState<filterSearchAll>({
        search_all: '',
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
        FilterInstance.setPisoShare(filterFields)
        setLoading(true)
    }

    useEffect(() => {
        if (flagFilter === 0) return
        
        let statusHttpUS = 200
        let dataFilter = {  search_all: filterFields.search_all.trim(),
                            tipo: 'all_pisos_share'
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
                    limit: filterFields.limit,
                    offset: filterFields.offset
                }
                
                // Consultar datos por paginación []
                FetchApiServiceInstance.getAllWithFilter(`/api/share/p/apartments`, { ..._dataFilter }, (err) => {
                    const { status } = err.response!
                    statusHttpUS = status
                }).then( data => {
                    if ( statusHttpUS === 200 && data ) {
                        let _data = (data as Array<IPiso>)
                        setListData([ ..._data ])
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
        // FetchApiServiceInstance.getAllWithFilter(SHARE_PISOS_PATH, { ...dataFilter }, (err) => {
        //     const { status } = err.response!
        //     statusHttpUS = status
        // }).then( data => {
        //     if ( statusHttpUS === 200 && data ) {
        //         // console.log(data)
        //         let _data = (data as Array<IPiso>)
        //         let _dList = [  ..._data.map(d => 
        //                 {
        //                     return { ...d }
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
        // if ( ['total', 'bs_nro_banios', 'ds_nro_camas', 'ds_nro_dormitorios', 'cp_ocupacion_maxima', 'total_start', 'total_end'].includes(e.target.name as string) ) {
        //     _value = parseInt(isNaN(e.target.value) ? -1 : e.target.value) < 0 ? -1 : e.target.value
        // }
        
        setFilterFields({
            ...filterFields,
            [e.target.name]: _value
        })
    }

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            setFlagFilter((flagFilter) => { return flagFilter + 1 })
            setFilterFields((current) => ({...current, offset: 0}))
            setPageCurrent(0)
            FilterInstance.setPisoShare(filterFields)
            setLoading(true)
        }
        // if (e.key === 'Enter') {
        //     setFlagFilter((flagFilter) => { return flagFilter + 1 })
        //     FilterInstance.setPisoComercial(filterFields)
        //     setLoading(true)
        // }
    }

    useEffect(() => {
        // setFilterFields(FilterInstance.getPisoShare() as filterSearchAll)
        setFilterFields((current) => ({...current, ...FilterInstance.getPisoShare()}))
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

export default usePisoShare;
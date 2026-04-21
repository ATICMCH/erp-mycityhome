import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import FilterInstance from '@/client/helpers/Filter'
import { IData } from '@/client/models/IData'
import { ILead } from '@/client/models/ILead'
import { DN_GET_TYPE_RESPONSABLE_PATH } from '@/client/helpers/constants'
import { IResponsableLead } from '@/client/models/IResponsableLead'


type filterSearchAll = {
    ns_start: string, 
    ns_end: string, 
    idresponsable: number, 
    tipo_lead: string, 
    estatus: number,
    search_all: string
    limit: number,
    offset: number
}

const limit = 50

const useLead = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<ILead>>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState<number>(0)
    const [pageCurrent, setPageCurrent] = useState<number>(0)

    const [filterFields, setFilterFields] = useState<filterSearchAll>({
        ns_start:'', 
        ns_end:'', 
        idresponsable: 0, 
        tipo_lead: '', 
        estatus: 1,
        telefono: '',
        persona: '',
        search_all: '',
        limit: limit,
        offset: 0
        } as filterSearchAll)
    const [flagFilter, setFlagFilter] = useState<number>(0)

    const [listResponsable, setListResponsable] = useState<Array<{ key:string, name: string }>>([])

    const handlerOnPage = (e: any) => {
        setPageCurrent(e.selected)
        setFilterFields( (current) => ({...current, offset: (e.selected * limit) % total}) )
        setFlagFilter( (flagFilter) => { return flagFilter + 1 } )
        setLoading(true)
    }

    useEffect(() => {
        if (flagFilter === 0) return
        
        let statusHttpUS = 200
        // let dataFilter_ = {
        //     search_all: filterFields.search_all.trim(),
        //     m_start: filterFields.m_start, 
        //     m_end: filterFields.m_end,
        //     iduser: filterFields.iduser,
        //     tipo: 'all_leads'
        // }

        let dataFilter = {  
            ns_start: filterFields.ns_start, 
            ns_end: filterFields.ns_end,
            idresponsable: filterFields.idresponsable,
            tipo_lead: filterFields.tipo_lead,
            estatus: filterFields.estatus,
            search_all: filterFields.search_all.trim(),
            tipo: 'all_leads'
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

                // let __dataFilter = {
                //     search_all: filterFields.search_all.trim(),
                //     m_start: filterFields.m_start, 
                //     m_end: filterFields.m_end,
                //     iduser: filterFields.iduser,
                //     limit: filterFields.limit,
                //     offset: filterFields.offset
                // }

                let _dataFilter = {  
                    ns_start: filterFields.ns_start, 
                    ns_end: filterFields.ns_end,
                    idresponsable: filterFields.idresponsable,
                    tipo_lead: filterFields.tipo_lead,
                    estatus: filterFields.estatus,
                    search_all: filterFields.search_all.trim(),
                    limit: filterFields.limit,
                    offset: filterFields.offset
                }
                
                // Consultar datos por paginación []
                FetchApiServiceInstance.getAllWithFilter(`/api/share/p/leads/`, { ..._dataFilter }, (err) => {
                    const { status } = err.response!
                    statusHttpUS = status
                }).then( data => {
                    if ( statusHttpUS === 200 && data ) {
                        let _data = (data as Array<ILead>)
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
            // setTimeout(() => setLoading(false), 200)
            if ( _total === 0 ) {
                setLoading(false)
                setListData([])
            }
        })
    }, [flagFilter])

    const changeSearch = (e: any) => {
        let _value = e.target.value
        
        setFilterFields({
            ...filterFields,
            [e.target.name]: _value
        })
    }

    /**
     * Captura evento de enter de los inputs
     * @param e 
     */
    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            setFlagFilter((flagFilter) => { return flagFilter + 1 })
            setFilterFields((current) => ({...current, offset: 0}))
            setPageCurrent(0)
            FilterInstance.setLead(filterFields)
            setLoading(true)
        }
    }

    const handleActionSearch = () => {
        setFlagFilter((flagFilter) => { return flagFilter + 1 })
        setFilterFields((current) => ({...current, offset: 0}))
        setPageCurrent(0)
        FilterInstance.setLead(filterFields)
        setLoading(true)
    }

    useEffect(() => {
        let statusHttpResponsable = 200
        FetchApiServiceInstance.getAllData(`${DN_GET_TYPE_RESPONSABLE_PATH}`, (err) => {
            const { status } = err.response!
            statusHttpResponsable = status
        }).then( data => {
            let _data = [ ...(data as Array<IResponsableLead>) ]
            let idUserLogin = parseInt( localStorage.getItem('idlogin') || '0') || 0
            let _lTipoLeadFilter = (_data && _data.filter(el => el.idusuario_resp == idUserLogin ).map(el => ({ key: el.tipo_lead, name: `${el.tipo_lead}`})).sort((a, b) => a.key.localeCompare(b.key))) || []
            let _lResponsableFilter = (_data && _data.filter(_el => _el.tipo_lead.includes(_lTipoLeadFilter.map(el => el.key).join('|').trim() || '$_$') || _lTipoLeadFilter.length === 0 ) ) || []

            const _dataF = FilterInstance.getLead() as filterSearchAll
            FilterInstance.setLead({ ..._dataF })

            if ( _lResponsableFilter.length === 0  ) FilterInstance.setLead({ ...FilterInstance.getLead(), idresponsable: 0 })

            statusHttpResponsable === 200 && 
            _data && 
            setListResponsable( _data.map(el => ({ key: el.id.toString(), name: `${el.codigo} -> ${el.responsable}`})) )

            // setFilterFields(FilterInstance.getLead() as filterLead)
            // setFlagFilter((flagFilter) => { return flagFilter + 1 })
        
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
            setFilterFields((current) => ({...current, ...FilterInstance.getLead()}))
            setFlagFilter((flagFilter) => { return flagFilter + 1 })
        })

        // setFilterFields((current) => ({...current, ...FilterInstance.getLead()}))
        // setFlagFilter((flagFilter) => { return flagFilter + 1 })
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
        pageCurrent,
        listData,
        loading,
        filterFields,
        total,
        limit,
        flagFilter,
        listResponsable,
        changeSearch,
        handleKeyDown,
        handlerOnPage,
        handleActionSearch
    }
}

export default useLead
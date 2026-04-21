import { useEffect, useState } from 'react'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import { IEstadisticaDn } from '@/client/models/IEstadisticaDn'


type filterSearchAll = {
    m_start: string,
    m_end: string
}

const useReportLeadHistorial = () => {

    const [listData, setListData] = useState<Array<IEstadisticaDn>>([])
    const [loading, setLoading] = useState(false)
    const [flagFilter, setFlagFilter] = useState<number>(0)

    const [nroPropietario, setNroPropietario] = useState<IEstadisticaDn>() // nro-propietarios-contratados
    const [nroPrescriptor, setNroPrescriptor] = useState<IEstadisticaDn>() // nro-prescriptores-contratados
    
    
    const [callsPrescriptorToday, setCallsPrescriptorToday] = useState<IEstadisticaDn>() // llamadas_leads_prescriptores
    const [callsPropietarioToday, setCallsPropietarioToday] = useState<IEstadisticaDn>() // llamadas_leads_propietarios
    const [callsPropietarioContratadoToday, setCallsPropietarioContratadoToday] = useState<IEstadisticaDn>() // llamadas_propietario_contratados
    const [callsPrescriptorContratadoToday, setCallsPrescriptorContratadoToday] = useState<IEstadisticaDn>() // llamadas_prescriptores_contratados

    const [filterFields, setFilterFields] = useState<filterSearchAll>({
        m_start: '',
        m_end: ''
    } as filterSearchAll)

    const changeSearch = (e: any) => {
        let _value = e.target.value
        
        setFilterFields({
            ...filterFields,
            [e.target.name]: _value
        })
        setListData([])
        setFlagFilter(0)
    }

    const handleKeyDownMarcacion = (e: any) => {
        if (e.key === 'Enter') {
            if (filterFields.m_start === '' || filterFields.m_end === '') return
            setFlagFilter((flagFilter) => { return flagFilter + 1 })
            // FilterInstance.setPisoComercial(filterFields)
            setListData([])
            setLoading(true)
        }
    }

    const handleActionSearch = () => {
        if (filterFields.m_start === '' || filterFields.m_end === '') {
            alert('Ingresar rango de fechas')
            return
        }
        setFlagFilter((flagFilter) => { return flagFilter + 1 })
        setLoading(true)
    }

    useEffect(() => {
        if (flagFilter === 0) return
        
        let dataFilter = {  m_start: filterFields.m_start.trim(), 
            m_end: filterFields.m_end.trim(),       
        }

        let statusHttpUS = 200
        FetchApiServiceInstance.getAllWithFilter(`/api/dn/estadisticas/historial`, { ...dataFilter }, (err) => {
            const { status } = err.response!
        }).then( data => { if ( statusHttpUS === 200 && data ) {
                let _data = (data as Array<IEstadisticaDn>)
                console.log(_data)
                setListData([ ..._data ])
                setNroPropietario(_data.find(el => el.tipo.toLocaleLowerCase() === 'nro_propietarios_contratados'))
                setNroPrescriptor(_data.find(el => el.tipo.toLocaleLowerCase() === 'nro_prescriptores_contratados'))
                
                setCallsPrescriptorToday(_data.find(el => el.tipo.toLocaleLowerCase() === 'llamadas_leads_prescriptores'))
                setCallsPropietarioToday(_data.find(el => el.tipo.toLocaleLowerCase() === 'llamadas_leads_propietarios'))
                setCallsPropietarioContratadoToday(_data.find(el => el.tipo.toLocaleLowerCase() === 'llamadas_propietario_contratados'))
                setCallsPrescriptorContratadoToday(_data.find(el => el.tipo.toLocaleLowerCase() === 'llamadas_prescriptores_contratados'))
            } else {
                setListData([])
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
            setTimeout(() => setLoading(false), 200)
        })
    }, [flagFilter])

    return {
        listData,
        loading,

        filterFields,

        changeSearch,
        handleKeyDownMarcacion,
        handleActionSearch,

        nroPrescriptor,
        nroPropietario,
        callsPrescriptorToday,
        callsPropietarioToday,
        callsPropietarioContratadoToday,
        callsPrescriptorContratadoToday
    }
}

export default useReportLeadHistorial;
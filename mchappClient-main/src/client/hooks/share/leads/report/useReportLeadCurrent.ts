import { useEffect, useState } from 'react'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import { IEstadisticaDn } from '@/client/models/IEstadisticaDn'

const useReportLeadCurrent = () => {

    const [listData, setListData] = useState<Array<IEstadisticaDn>>([])

    const [loading, setLoading] = useState(true)

    const [allLeads, setAllLeads] = useState<IEstadisticaDn>() // all_leads
    const [nroPrescriptor, setNroPrescriptor] = useState<IEstadisticaDn>() // prescriptores_totales
    const [whatsappPrescriptor, setWhatsappPrescriptor] = useState<IEstadisticaDn>() // whatsapp_grupo_prescriptor
    const [leadsAtrasadosTotal, setLeadsAtrasadosTotal] = useState<IEstadisticaDn>() // leads_atrasados_total
    const [leadsAtrasadosPrescriptor, setLeadsAtrasadosPrescriptor] = useState<IEstadisticaDn>() // leads_atrasados_prescriptores
    const [leadsAtrasadosPropietario, setLeadsAtrasadosPropietario] = useState<IEstadisticaDn>() // leads_atrasados_propietarios
    const [callsPrescriptorToday, setCallsPrescriptorToday] = useState<IEstadisticaDn>() // llamadas_leads_prescriptores
    const [callsPropietarioToday, setCallsPropietarioToday] = useState<IEstadisticaDn>() // llamadas_leads_propietarios
    const [callsPropietarioContratadoToday, setCallsPropietarioContratadoToday] = useState<IEstadisticaDn>() // llamadas_propietario_contratados
    const [callsPrescriptorContratadoToday, setCallsPrescriptorContratadoToday] = useState<IEstadisticaDn>() // llamadas_prescriptores_contratados

    const [leadsPendientesToday, setLeadsPendientesToday] = useState<IEstadisticaDn>() // leads_pendientes_hoy


    useEffect(() => {
        let statusDataId = 200
        setLoading(true)

        FetchApiServiceInstance.getAllData(`/api/dn/estadisticas/current`, (err) => {
            const { status } = err.response!
            statusDataId = status
        }).then( data => {
            if ( statusDataId === 200 && data ) {
                let _data = (data as Array<IEstadisticaDn>)
                setListData([ ..._data ])
                setAllLeads(_data.find(el => el.tipo.toLocaleLowerCase() === 'all_leads'))
                setNroPrescriptor(_data.find(el => el.tipo.toLocaleLowerCase() === 'prescriptores_totales'))
                setWhatsappPrescriptor(_data.find(el => el.tipo.toLocaleLowerCase() === 'whatsapp_grupo_prescriptor'))
                setLeadsAtrasadosTotal(_data.find(el => el.tipo.toLocaleLowerCase() === 'leads_atrasados_total'))
                setLeadsAtrasadosPrescriptor(_data.find(el => el.tipo.toLocaleLowerCase() === 'leads_atrasados_prescriptores'))
                setLeadsAtrasadosPropietario(_data.find(el => el.tipo.toLocaleLowerCase() === 'leads_atrasados_propietarios'))
                setCallsPrescriptorToday(_data.find(el => el.tipo.toLocaleLowerCase() === 'llamadas_leads_prescriptores'))
                setCallsPropietarioToday(_data.find(el => el.tipo.toLocaleLowerCase() === 'llamadas_leads_propietarios'))
                setCallsPropietarioContratadoToday(_data.find(el => el.tipo.toLocaleLowerCase() === 'llamadas_propietario_contratados'))
                setCallsPrescriptorContratadoToday(_data.find(el => el.tipo.toLocaleLowerCase() === 'llamadas_prescriptores_contratados'))
                setLeadsPendientesToday(_data.find(el => el.tipo.toLocaleLowerCase() === 'leads_pendientes_hoy'))
            }
        }).catch(err => {}).finally(()=>{
            setLoading(false)
        })
    }, [])

    return {
        listData,
        allLeads,
        nroPrescriptor,
        whatsappPrescriptor,
        leadsAtrasadosTotal,
        leadsAtrasadosPrescriptor,
        leadsAtrasadosPropietario,
        callsPrescriptorToday,
        callsPropietarioToday,
        callsPropietarioContratadoToday,
        callsPrescriptorContratadoToday,
        leadsPendientesToday,
        loading
    }
}

export default useReportLeadCurrent;
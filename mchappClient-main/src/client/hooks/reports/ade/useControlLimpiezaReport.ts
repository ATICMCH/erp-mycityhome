import { useEffect, useState } from 'react'

import FetchApiServiceInstance from '@/client/services/FetchApiService';

type filterSearchAll = {
    m_start: string,
    m_end: string,
    
    // filter report details
    m_start_2: string,
    m_end_2: string,
    m_user_2: number
}


/**
 * 
 * @returns 
 */
const useControlLimpiezaReport = () => {

    // Reporte I
    const [listData, setListData] = useState<Array<any>>([])
    const [loading, setLoading] = useState(false)
    const [flagFilter, setFlagFilter] = useState<number>(0)

    // Report II
    const [listDataDetails, setListDataDetails] = useState<Array<any>>([])
    const [loadingDetails, setLoadingDetails] = useState(false)
    const [flagFilterDetails, setFlagFilterDetails] = useState<number>(0)

    // Usuarios Limpieza
    const [listDataUser, setListDataUser] = useState<Array<any>>([])

    const [filterFields, setFilterFields] = useState<filterSearchAll>({
        m_start: '',
        m_end: '',
        m_start_2: '',
        m_end_2: '',
        m_user_2: 0
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
        // /api/reports/roleade/controlhorario
        FetchApiServiceInstance.getAllWithFilter(`/api/reports/roleade/controlhorario`, { ...dataFilter }, (err) => {
            const { status } = err.response!
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                // console.log(data)
                let _data = (data as Array<any>)
                setListData(_data)
            } else {
                setListData([])
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
            setTimeout(() => setLoading(false), 200);
        })
    }, [flagFilter])

    // Obtiene los usuarios de limpieza
    useEffect(() => {
        let statusHttpUS = 200
        // /api/reports/roleade/controlhorario
        FetchApiServiceInstance.getAllData(`/api/share/users/ulimpieza`, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _data = (data as Array<any>)
                setListDataUser(_data.map(el => ({key: `${el.id}`, name: el.nombre_completo})))
            } else {
                setListDataUser([])
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
            // setTimeout(() => setLoadingDetails(false), 200);
        })
    }, [])


    // Reporte II
    const changeSearchReportII = (e: any) => {
        let _value = e.target.value
        setFilterFields({
            ...filterFields,
            [e.target.name]: _value
        })
        setListDataDetails([])
        setFlagFilterDetails(0)
    }

    const handleKeyDownMarcacionReportII = (e: any) => {
        if (e.key === 'Enter') {
            if (filterFields.m_start_2 === '' || filterFields.m_end_2 === '') return
            setFlagFilterDetails((flagFilterDetails) => { return flagFilterDetails + 1 })
            setListDataDetails([])
            setLoadingDetails(true)
        }
    }

    const handleActionSearchReportII = () => {
        if (filterFields.m_start_2 === '' || filterFields.m_end_2 === '') {
            alert('Ingresar rango de fechas')
            return
        }
        setFlagFilterDetails((flagFilterDetails) => { return flagFilterDetails + 1 })
        setLoadingDetails(true)
    }

    useEffect(() => {
        if (flagFilterDetails === 0) return
        
        let dataFilter = {  
            m_start: filterFields.m_start_2.trim(), 
            m_end: filterFields.m_end_2.trim(),       
        }

        let statusHttpUS = 200
        // /api/reports/roleade/users/[id]/controlhorario
        FetchApiServiceInstance.getAllWithFilter(`/api/reports/roleade/users/${filterFields.m_user_2}/controlhorario`, { ...dataFilter }, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _data = (data as Array<any>)
                setListDataDetails(_data)
            } else {
                setListDataDetails([])
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
            setTimeout(() => setLoadingDetails(false), 200);
        })
    }, [flagFilterDetails])

    return {
        listData,
        loading,
        filterFields,
        flagFilter,
        changeSearch,
        handleKeyDownMarcacion,
        handleActionSearch,

        listDataUser,

        listDataDetails,
        loadingDetails,
        flagFilterDetails,
        changeSearchReportII,
        handleKeyDownMarcacionReportII,
        handleActionSearchReportII
    }
}

export default useControlLimpiezaReport;
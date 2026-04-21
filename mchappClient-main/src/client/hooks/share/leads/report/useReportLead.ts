import { useEffect, useState } from 'react'

const useReportLead = () => {
    const [listType, setListType] = useState<Array<{ key:string, name: string, lbl: string }>>([{key: '1', name:'actual', lbl:'Actual'},{key: '2', name:'historial', lbl: 'Historial'}])
    const [flagType, setFlagType] = useState<number|null>(-1)
    
    const [dataTypeDeviceSel, setDataTypeDeviceSel] = useState<{id: number, code: string}>({ id: 0, code:''})

    useEffect(() => {
        let _data = listType[ flagType === null ? -1 : flagType ] || { key: '0', name:''}
        setDataTypeDeviceSel({id: parseInt(_data.key), code: _data.name})
    }, [flagType])

    useEffect(() => {
        setDataTypeDeviceSel({ id: 0, code:'actual'})
        setFlagType(0)
    }, [])

    return {
        listType,
        flagType,
        setFlagType,
        dataTypeDeviceSel
    }
}

export default useReportLead;
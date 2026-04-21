import React, { useEffect, useState } from 'react'
import ControlLimpiezaItem from './ControlLimpiezaItem'
import { IControlHorarioLimpieza } from '@/client/models/IControlHorarioLimpieza'

const ControlLimpiezaList = ({ items }: { items: Array<IControlHorarioLimpieza> }) => {
    // const [ statusTooltip, setStatusTooltip ] = useState<boolean>(false)
    // const [ idTooltipSelected, setIdTooltipSelected ] = useState<string>('')

    return (
        <div className="bg-white table-content">
            { 
                items.map((item, index) => {
                    return <ControlLimpiezaItem key={'item-cl' + index} item={item} />
                })
            }
        </div>
    )
}

export default ControlLimpiezaList
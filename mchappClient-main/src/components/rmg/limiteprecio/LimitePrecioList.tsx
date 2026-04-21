import React, { useEffect, useState } from 'react'
import LimitePrecioItem from './LimitePrecioItem'
import { ISolicitudPrecio } from '@/client/models/ISolicitudPrecio'

const LimitePrecioList = ({ items }: { items: Array<ISolicitudPrecio> }) => {
    // const [ statusTooltip, setStatusTooltip ] = useState<boolean>(false)
    // const [ idTooltipSelected, setIdTooltipSelected ] = useState<string>('')

    return (
        <div className="bg-white table-content">
            { 
                items.map((item, index) => {
                    return <LimitePrecioItem key={'item-slp' + index} item={item} />
                })
            }
        </div>
    )
}

export default LimitePrecioList
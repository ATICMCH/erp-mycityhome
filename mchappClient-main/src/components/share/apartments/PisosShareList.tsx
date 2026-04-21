import React, { useState } from 'react'
import { IPiso } from '@/client/models/IPiso'
import PisosShareItem from './PisosShareItem'

const PisosShareList = ({ items }: { items: Array<IPiso> }) => {
    const [ statusTooltip, setStatusTooltip ] = useState<boolean>(false)
    const [ idTooltipSelected, setIdTooltipSelected ] = useState<string>('')

    return (
        <div className="grid grid-flow-row space-y-3 w-full">
            { 
                items.map((item, index) => {
                    return <PisosShareItem setStatusTooltip={setStatusTooltip} statusTooltip={statusTooltip} idTooltipSelected={idTooltipSelected} setIdTooltipSelected={setIdTooltipSelected} key={'item-piso' + index} position={`item-piso-${index}`} item={item} />
                })
            }
        </div>
    )
}

export default PisosShareList

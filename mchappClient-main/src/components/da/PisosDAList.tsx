import React, { useState } from 'react'
import PisosDAItem from './PisosDAItem'
import { IPiso } from '@/client/models/IPiso'

const PisosDAList = ({ items }: { items: Array<IPiso> }) => {
    const [ statusTooltip, setStatusTooltip ] = useState<boolean>(false)
    const [ idTooltipSelected, setIdTooltipSelected ] = useState<string>('')

    return (
        <div className="flex flex-col gap-3 w-full px-2 sm:px-4">
            { 
                items.map((item, index) => {
                    return <PisosDAItem setStatusTooltip={setStatusTooltip} statusTooltip={statusTooltip} idTooltipSelected={idTooltipSelected} setIdTooltipSelected={setIdTooltipSelected} key={'item-piso' + index} position={`item-piso-${index}`} item={item} />
                })
            }
        </div>
    )
}

export default PisosDAList
import React, { useEffect, useState } from 'react'
import PComercialItem from './PComercialItem'
import { IInfoPisoComercial } from '@/client/models/IInfoPisoComercial'

const PComercialList = ({ items }: { items: Array<IInfoPisoComercial> }) => {
    const [ statusTooltip, setStatusTooltip ] = useState<boolean>(false)
    const [ idTooltipSelected, setIdTooltipSelected ] = useState<string>('')

    return (
        <div className="grid grid-flow-row space-y-3">
            { 
                items.sort((a, b) => {
                    const etiquetaA = a.etiqueta || a.a_etiqueta || '';
                    const etiquetaB = b.etiqueta || b.a_etiqueta || '';
                    return etiquetaA.localeCompare(etiquetaB);
                }).map((item, index) => {
                    return <PComercialItem 
                        setStatusTooltip={setStatusTooltip} 
                        statusTooltip={statusTooltip} 
                        idTooltipSelected={idTooltipSelected} 
                        setIdTooltipSelected={setIdTooltipSelected} 
                        key={'item-piso' + index} 
                        position={`item-piso-${index}`} 
                        item={item} 
                    />
                })
            }
        </div>
    )
}

export default PComercialList
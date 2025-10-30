import React from 'react'
import { IDevice } from '@/client/models/IDevice'
import DevicesItem from './DevicesItem'

const DevicesList = ({ items }: { items: Array<IDevice> }) => {
    // const [ statusTooltip, setStatusTooltip ] = useState<boolean>(false)
    // const [ idTooltipSelected, setIdTooltipSelected ] = useState<string>('')

    return (
        <div className="bg-white table-content">
            { 
                items.map((item, index) => {
                    return <DevicesItem key={'item-cl' + index} item={item} />
                })
            }
        </div>
    )
}

export default DevicesList
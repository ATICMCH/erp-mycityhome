import React from 'react'
import { IDevice } from '@/client/models/IDevice'
import ReportDeviceItem from './ReportDeviceItem'
import { IDeviceReport } from '@/client/models/IDeviceReport'

const ReportDeviceList = ({ items }: { items: Array<IDeviceReport> }) => {
    // const [ statusTooltip, setStatusTooltip ] = useState<boolean>(false)
    // const [ idTooltipSelected, setIdTooltipSelected ] = useState<string>('')

    return (
        <div className="bg-white table-content">
            { 
                items.map((item, index) => {
                    return <ReportDeviceItem key={'item-cl' + index} item={item} />
                })
            }
        </div>
    )
}

export default ReportDeviceList
import React from 'react'
import { useRouter } from 'next/router'
import { AiOutlineFilePdf } from 'react-icons/ai'
import useReportDeviceItem from '@/client/hooks/atic/reportdevice/useReportDeviceItem'
import { IDeviceReport } from '@/client/models/IDeviceReport'

import dynamic from "next/dynamic"
import { BsPencilFill } from 'react-icons/bs'
const DeviceStateReportPDF = dynamic(()=>import("@/components/pdf/reportes/atic/devicesstate/DeviceStateReport"),{ssr:false})

const ReportDeviceItem = ({ item } : 
                            {
                                item: IDeviceReport
                            }) => {

    const router = useRouter()

    const {  
            itemContent,
            goEditData,
            eventMap,
            handlerReport
        } = useReportDeviceItem(item)

    /**
     * Retorna color row
     * @param estado 
     * @param etiqueta 
     * @returns 
     */
    const getColorRow = (estado: number, etiqueta: string, estado_piso: number): string => {
        if ( etiqueta.toLocaleLowerCase() === 'libre') return 'text-[green] text-bold'
        else if(estado_piso === 0 || estado_piso === -1) return 'text-[red] text-bold'
        return 'text-[#0077BD]'
    }

    const getBackgroudRow = (estado: number): string => {
        if (estado === 0) return 'bg-[#fde3b2]'
        else if (estado === -1) return 'bg-[#fbd0d0]'
        return ''
    }

    return (
        <div className={`w-full h-auto`}>
            <div 
                className={`data-table-row-nopointer grid grid-cols-6 p-1 pl-2 text-[#0077BD]`}>
                <div>
                    <span className='flex'>
                        &nbsp;&nbsp;{itemContent.id}
                    </span>
                </div>

                <div className='grid col-span-2'>
                    <span className='flex'>
                        {itemContent.fecha}
                    </span>
                </div>

                <div className='grid col-span-2'>
                    <span className='flex'>
                        {itemContent.tipo}
                    </span>
                </div>

                <div className='flex justify-end'>
                    <DeviceStateReportPDF idReport={itemContent.id!} dateReport={itemContent.fecha!}  />
                    <div onClick={() => goEditData(itemContent.id!)} className='icon-table-row grid justify-center rounded-full w-[1.8rem] h-[1.6rem] card-action'>
                        <BsPencilFill className='mt-1' title='Editar' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportDeviceItem
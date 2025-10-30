import React from 'react'
import { useRouter } from 'next/router'

import { ReportDetailsType } from '@/client/types/globalTypes'
import useReportDetailsDeviceItem from '@/client/hooks/atic/reportdevice/useReportDetailsDeviceItem'

const ReportDetailsDeviceItem = ({ item, idReport } : 
                            {
                                item: ReportDetailsType,
                                idReport: number
                            }) => {
    const {  
            itemContent,
            handlerSaveByState,
            handlerSaveByStateLock,
            saveStateLockKeyDown,
            itemMovil,
            itemLock,
            itemSonoff,
            itemTelefonillo,
            itemCamara
    } = useReportDetailsDeviceItem(item, idReport)

    return (
        <div className={`w-full h-auto`}>
            <div 
                className={`data-table-row-nopointer grid grid-cols-12 p-1 pl-2 text-[#0077BD]`}>
                <div className='grid col-span-2'>
                    <span className='flex'>
                        {itemContent.etiqueta}
                    </span>
                </div>
                { /* Movil */ }
                <div className='grid col-span-2'>
                    {
                        itemMovil ?
                            <div className="flex">
                                <div className="flex items-center mr-4">
                                    <input checked={itemMovil!.state.toLocaleLowerCase() === 'online'} onChange={handlerSaveByState} type="radio" value="Online" name={`state_movil_${itemMovil.iddetallereporte}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label className="ml-1 text-sm font-medium text-gray-900 text-bold dark:text-black-300">On</label>
                                </div>
                                <div className="flex items-center mr-4">
                                    <input checked={itemMovil!.state.toLocaleLowerCase() === 'offline'} onChange={handlerSaveByState} type="radio" value="Offline" name={`state_movil_${itemMovil.iddetallereporte}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label className="ml-1 text-sm font-medium text-gray-900 text-bold dark:text-black-300">Off</label>
                                </div>
                            </div>
                        :
                        ''
                    }
                </div>
                
                { /* Lock */ }
                <div className='grid col-span-2'>
                    <span className='flex'>
                        {
                            itemLock ? 
                                <input onChange={handlerSaveByStateLock} onKeyDown={saveStateLockKeyDown} className="h-min rounded-r-full1 p-2 w-[4rem] outline-blue-800" type='number' value={itemLock?.state} name={`state_lock_${itemLock.iddetallereporte}`} />
                            :
                            ''
                        }
                    </span>
                </div>
                
                { /* SonOff */ }
                <div className='grid col-span-2'>
                    {
                        itemSonoff ?
                            <div className="flex">
                                <div className="flex items-center mr-4">
                                    <input checked={itemSonoff!.state.toLocaleLowerCase() === 'online'} onChange={handlerSaveByState} type="radio" value="Online" name={`state_sonoff_${itemSonoff.iddetallereporte}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label className="ml-1 text-sm font-medium text-gray-900 text-bold dark:text-black-300">On</label>
                                </div>
                                <div className="flex items-center mr-4">
                                    <input checked={itemSonoff!.state.toLocaleLowerCase() === 'offline'} onChange={handlerSaveByState} type="radio" value="Offline" name={`state_sonoff_${itemSonoff.iddetallereporte}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label className="ml-1 text-sm font-medium text-gray-900 text-bold dark:text-black-300">Off</label>
                                </div>
                            </div>
                        :
                        ''
                    }
                </div>

                { /* Telefonillo */ }
                <div className='grid col-span-2'>
                    {
                        itemTelefonillo ?
                            <div className="flex">
                                <div className="flex items-center mr-4">
                                    <input checked={itemTelefonillo!.state.toLocaleLowerCase() === 'online'} onChange={handlerSaveByState} type="radio" value="Online" name={`state_telefonillo_${itemTelefonillo.iddetallereporte}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label className="ml-1 text-sm font-medium text-gray-900 text-bold dark:text-black-300">On</label>
                                </div>
                                <div className="flex items-center mr-4">
                                    <input checked={itemTelefonillo!.state.toLocaleLowerCase() === 'offline'} onChange={handlerSaveByState} type="radio" value="Offline" name={`state_telefonillo_${itemTelefonillo.iddetallereporte}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label className="ml-1 text-sm font-medium text-gray-900 text-bold dark:text-black-300">Off</label>
                                </div>
                            </div>
                        :
                        ''
                    }
                </div>
                <div className='grid col-span-2'>
                    {
                        itemCamara ?
                            <div className="flex">
                                <div className="flex items-center mr-4">
                                    <input checked={itemCamara!.state.toLocaleLowerCase() === 'online'} onChange={handlerSaveByState} type="radio" value="Online" name={`state_camara_${itemCamara.iddetallereporte}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label className="ml-1 text-sm font-medium text-gray-900 text-bold dark:text-black-300">On</label>
                                </div>
                                <div className="flex items-center mr-4">
                                    <input checked={itemCamara!.state.toLocaleLowerCase() === 'offline'} onChange={handlerSaveByState} type="radio" value="Offline" name={`state_camara_${itemCamara.iddetallereporte}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label className="ml-1 text-sm font-medium text-gray-900 text-bold dark:text-black-300">Off</label>
                                </div>
                            </div>
                        :
                        ''
                    }
                </div>
            </div>
        </div>
    )
}

export default ReportDetailsDeviceItem
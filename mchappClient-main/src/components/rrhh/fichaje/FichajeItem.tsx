import React from 'react'
import { useRouter } from 'next/router'
import UtilCustomInstance from '@/client/helpers/UtilCustom'
import { BsPencilFill } from 'react-icons/bs'
import { IFichaje } from '@/client/models/IFichaje'
import useFichajeItem from '@/client/hooks/rrhhmaster/fichaje/useFichajeItem'

import { FaSadTear, FaSmile } from 'react-icons/fa'

const FichajeItem = ({ item } : 
                            {
                                item: IFichaje
                            }) => {

    const router = useRouter()

    const {  
            itemContent,
            goEditData
        } = useFichajeItem(item)

    // const getValueHoras = (dateStart: string, dateEnd: string): string => {
    //     if (dateStart.trim() === '' || dateEnd.trim() === '') return '0h 0min'
    //     let {h, m} = UtilCustomInstance.getHoursMinDiff(`${dateStart}:00`, `${dateEnd}:00`)
    //     return `${h}h ${m}min`
    // }

    const puntualidad = (item: IFichaje) => {
        const { fecha: fechaCurrent, hora: horaCurrent } = UtilCustomInstance.getDateCurrent()
        let _milSecondsLimite = UtilCustomInstance.getDateCustom(item.fecha || fechaCurrent, '09:03:00').timestamp
        let _milSecondsEntrada = UtilCustomInstance.getDateCustom( item.fecha || fechaCurrent, `${ item.h_entrada ? `${item.h_entrada}:00` : horaCurrent }` ).timestamp
        
        if ( _milSecondsEntrada > _milSecondsLimite ) return <FaSadTear size={16} color='rgb(239 68 68)' />
        else return <FaSmile size={16} color='rgb(77 124 15)' />
    }

    return (
        <div className={`w-full h-auto`}>
            {/* <div className="grid pl-2 pr-2"> #0077BD 0077bd #d2ebf9*/}
            {/* <div className={`grid grid-cols-7 p-1 pl-2 text-[#0077BD]`}> */}
            {/* <div 
                className={`data-table-row-nopointer grid grid-cols-8 p-1 pl-2 text-[#0077BD]`}> */}
            <div 
                className={`data-table-row-nopointer grid grid-cols-7 p-1 pl-2 ${itemContent.fecha_str === UtilCustomInstance.toFormatSanDiego(UtilCustomInstance.getDateCurrent().fecha).fecha? 'text-[#0077BD] text-bold' : (itemContent.fecha_str !== UtilCustomInstance.toFormatSanDiego(UtilCustomInstance.getDateCurrent().fecha).fecha && (itemContent.h_salida === '' || itemContent.h_salida === undefined))?'text-[red] text-bold':'text-[#0077BD]'}`}>
                <div>
                    <span className='flex'>
                        {UtilCustomInstance.getLabelRoleMultiLogin(itemContent.idrol || '')}
                    </span>
                </div>
                <div className="grid col-span-2">
                    <span className='flex'>
                    { puntualidad(itemContent) }&nbsp;{itemContent.full_name}
                    </span>
                </div>

                <div>
                    <span className='flex'>
                        {itemContent.fecha_str}
                    </span>
                </div>

                <div>
                    <span className='flex'>
                        {itemContent.h_entrada}
                    </span>
                </div>

                <div>
                    <span className='flex'>
                        {itemContent.h_salida}
                    </span>
                </div>

                <div className='grid justify-end'>
                    <div onClick={() => goEditData(itemContent.id!)} className='icon-table-row grid justify-end rounded-full w-[1.8rem] h-[1.6rem] card-action'>
                        <BsPencilFill className='mt-1' title='Editar' />
                    </div>
                </div>                
            </div>
        </div>
    )
}

export default FichajeItem
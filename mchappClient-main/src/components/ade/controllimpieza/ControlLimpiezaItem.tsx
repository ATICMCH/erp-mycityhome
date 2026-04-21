import React from 'react'
import { useRouter } from 'next/router'
import { IControlHorarioLimpieza } from '@/client/models/IControlHorarioLimpieza'
import useControlLimpiezaItem from '@/client/hooks/ade/controllimpieza/useControlLimpiezaItem'
import UtilCustomInstance from '@/client/helpers/UtilCustom'
import { BsPencilFill } from 'react-icons/bs'

const ControlLimpiezaItem = ({ item } : 
                            {
                                item: IControlHorarioLimpieza
                            }) => {

    const router = useRouter()

    const {  
            itemContent,
            goEditData,
            eventMap
        } = useControlLimpiezaItem(item)

    const getValueHoras = (dateStart: string, dateEnd: string): string => {
        if (dateStart.trim() === '' || dateEnd.trim() === '') return '0h 0min'
        let {h, m} = UtilCustomInstance.getHoursMinDiff(`${dateStart}:00`, `${dateEnd}:00`)
        return `${h}h ${m}min`
    }

    return (
        <div className={`w-full h-auto`}>
            {/* <div className="grid pl-2 pr-2"> #0077BD 0077bd #d2ebf9*/}
            {/* <div className={`grid grid-cols-7 p-1 pl-2 text-[#0077BD]`}> */}
            <div 
                className={`data-table-row-nopointer grid grid-cols-7 p-1 pl-2 ${itemContent.fecha === UtilCustomInstance.toFormatSanDiego(UtilCustomInstance.getDateCurrent().fecha).fecha? 'text-[green] text-bold' : (itemContent.fecha !== UtilCustomInstance.toFormatSanDiego(UtilCustomInstance.getDateCurrent().fecha).fecha && (itemContent.h_salida === '' || itemContent.h_salida === undefined))?'text-[red] text-bold':'text-[#0077BD]'}`}>
                <div>
                    <span className='flex'>
                        {itemContent.etiqueta_piso}
                    </span>
                </div>

                <div>
                    <span className='flex'>
                        {itemContent.full_name}
                    </span>
                </div>

                <div>
                    <span className='grid justify-end'>
                        {itemContent.fecha}
                    </span>
                </div>

                <div>
                    <span className='grid justify-end'>
                        {itemContent.h_entrada}
                    </span>
                </div>

                <div>
                    <span className='grid justify-end'>
                        {itemContent.h_salida}
                    </span>
                </div>

                <div>
                    <span className='flex grid justify-end'>
                        {
                            getValueHoras(itemContent.entrada || '', itemContent.salida || '')
                        }
                    </span>
                </div>

                <div className='flex justify-end'>
                    <div onClick={() => goEditData(itemContent.id!)} className='icon-table-row grid justify-center rounded-full w-[1.8rem] h-[1.6rem] card-action'>
                        <BsPencilFill className='mt-1' title='Editar' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ControlLimpiezaItem
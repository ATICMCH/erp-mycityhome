import React from 'react'
import { useRouter } from 'next/router'
import UtilCustomInstance from '@/client/helpers/UtilCustom'
import useLimitePrecioItem from '@/client/hooks/rmg/limiteprecio/useLimitePrecioItem'
import { ISolicitudPrecio } from '@/client/models/ISolicitudPrecio'
import { AiFillCheckCircle, AiFillCloseCircle, AiOutlineQuestion } from 'react-icons/ai'
import { BsFillQuestionOctagonFill, BsQuestionCircleFill } from 'react-icons/bs'

const LimitePrecioItem = ({ item } : 
                            {
                                item: ISolicitudPrecio
                            }) => {

    const router = useRouter()

    const {  
            itemContent,
            goEditData,
            eventMap
        } = useLimitePrecioItem(item)

    const getValueHoras = (dateStart: string, dateEnd: string): string => {
        if (dateStart.trim() === '' || dateEnd.trim() === '') return '0h 0min'
        let {h, m} = UtilCustomInstance.getHoursMinDiff(`${dateStart}:00`, `${dateEnd}:00`)
        return `${h}h ${m}min`
    }

    const getStateIcon = (code: string) => {
        if(code === "Pendiente") return <BsFillQuestionOctagonFill color='#ff8d1a' />
        else if (code === "Aprobado") return <AiFillCheckCircle color='green' size={20}  />
        else if (code === "Rechazado") return <AiFillCloseCircle color='red' size={20} />
        else return ''
    }

    return (
        <div className={`w-full h-auto`}>
            {/* <div className="grid pl-2 pr-2"> #0077BD 0077bd #d2ebf9*/}
            {/* <div className={`grid grid-cols-7 p-1 pl-2 text-[#0077BD]`}> */}
            <div 
                onClick={() => goEditData(itemContent.id as number)}
                className={`data-table-row grid grid-cols-6 p-1 pl-2 text-[#0077BD]`}>
                <div>
                    <span className='flex'>
                        { getStateIcon(item.lbl_estado_solicitud || '') } &nbsp;{itemContent.piso}
                    </span>
                </div>

                <div className='grid col-span-2'>
                    <span className='flex'>
                        {itemContent.propietario}
                    </span>
                </div>

                <div>
                    <span className='grid justify-end'>
                        {itemContent.f_fecha_creacion}
                    </span>
                </div>

                <div>
                    <span className='grid justify-end'>
                        {itemContent.limite_precio} €
                    </span>
                </div>

                <div>
                    <span className='grid justify-end'>
                        {itemContent.porcentaje_limite_precio} %
                    </span>
                </div>
            </div>
        </div>
    )
}

export default LimitePrecioItem
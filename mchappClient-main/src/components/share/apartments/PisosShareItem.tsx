import React from 'react'
import { TbBrandAirbnb, TbBrandBooking, TbBrandBitbucket, TbBrandApple } from 'react-icons/tb'
import{ BiAccessibility, BiBath, BiBed, BiDetail, BiMale } from 'react-icons/bi'
import { useRouter } from 'next/router'
import { MdHomeFilled } from 'react-icons/md'
import { AiFillBulb, AiFillEnvironment, AiFillLock, AiFillSave, AiFillVideoCamera, AiOutlineBulb, AiOutlineClose, AiOutlineEnvironment, AiOutlineLink, AiOutlineLock, AiOutlineMobile, AiOutlinePhone, AiOutlineVideoCamera, AiTwotoneEdit } from 'react-icons/ai'
import ValidationsInstance from '@/client/helpers/Validations'
import { BsDoorClosed, BsPencilSquare } from 'react-icons/bs'
import ElevadorIcon from '../../Iconos/ElevadorIcon'
import CalefaccionIcon from '../../Iconos/CalefaccionIcon'
import AreaMMIcon from '../../Iconos/AreaMMIcon'
import AireAconIcon from '../../Iconos/AireAconIcon'
import { IPiso } from '@/client/models/IPiso'
import Link from 'next/link'
import SofaCamaIcon from '../../Iconos/SofaCamaIcon'
import usePisoShareItem from '@/client/hooks/share/apartments/usePisoShareItem'

const PisosShareItem = ({   position, item, statusTooltip, idTooltipSelected, setStatusTooltip, setIdTooltipSelected } : 
                            {
                                position: string,
                                item: IPiso, 
                                statusTooltip: boolean, 
                                idTooltipSelected: string,
                                setStatusTooltip: (value: boolean | ((prevVar: boolean) => boolean)) => void,
                                setIdTooltipSelected: (value: string | ((prevVar: string) => string)) => void
                            }) => {

    const router = useRouter()

    const { itemContent,
            eventMap
        } = usePisoShareItem(item, setStatusTooltip, setIdTooltipSelected)

    return (
        <div className={`card-action1 w-full lg:h-min-[9rem] md:h-min-[9rem] h-auto rounded-2xl ${(itemContent.estado === 0)?'bg-red-50 border-2 border-[red]':'bg-[#ffffffc8]'} grid items-center p-5`}>
            <div className="grid lg:grid-flow-col md:grid-flow-col lg:grid-cols-none md:grid-cols-none grid-cols-1 sm:grid-cols-3 lg:space-x-5 md:space-x-5 space-x-0 gap-4">
                <div className="text-lg">
                    <h3 className={`font-bold ${(itemContent.estado === 0) ? 'text-[red]' : 'text-blue-700'}`}>
                        <span className='flex flex-wrap items-center gap-1'>
                            {itemContent.etiqueta}&nbsp;
                            {
                                ValidationsInstance.checkUrl(itemContent.ubicacion_mapa || '') ? 
                                    <Link href={`${itemContent.ubicacion_mapa}`} target='_blank' onClick={eventMap} className='px-3m py-3m h-auto w-auto contents'>
                                        <AiFillEnvironment title='Ubicación mapa' color='#f15353' size={'1.5rem'} />
                                    </Link>
                                :
                                <AiFillEnvironment title='Ubicación mapa' color='#a8a8a8' size={'1.5rem'} />
                            }
                        </span>
                    </h3>
                    <div className='text-base'>
                        { itemContent.full_direccion }
                    </div>
                </div>
                <div className='w-full flex justify-end flex-wrap sm:pr-8 gap-2'>
                    <div className="text-lg flex flex-wrap gap-4 items-center">
                        <div className='flex font-bold' style={{fontSize: '17px'}}>
                            <span className='text-[#0077BD]'>{itemContent.cp_ocupacion_maxima}</span><BiMale title='Capacidad' size={'1.7rem'} />
                        </div>
                        <div className='flex font-bold' style={{fontSize: '17px'}}>
                            <span className='text-[#0077BD]'>{itemContent.ds_nro_dormitorios}</span>&nbsp;<BsDoorClosed title='Habitaciones' size={'1.7rem'} />
                        </div>
                        <div className='flex font-bold' style={{fontSize: '17px'}}>
                            <span className='text-[#0077BD]'>{itemContent.ds_nro_camas}</span>&nbsp;<BiBed title={`Camas ${(itemContent.ds_nro_camas?`, ${itemContent.ds_nro_camas}`:'')}`} size={'1.7rem'} />
                        </div>
                        <div className='flex font-bold' style={{fontSize: '17px'}}>
                            <span className='text-[#0077BD]'>{itemContent.bs_nro_banios}</span>&nbsp;<BiBath title='Baños' size={'1.7rem'} />
                        </div>
                        <div className='flex font-bold' style={{fontSize: '17px'}}>
                            <span className='text-[#0077BD]'>{itemContent.ds_nro_sofacama}</span>&nbsp;<SofaCamaIcon title={`Sofacama ${(itemContent.ds_descripcion_sofacama?`, ${itemContent.ds_descripcion_sofacama}`:'')}`} color={'black'} className='w-[1.8rem] h-[2.0rem]' />
                        </div>
                        <div className='flex font-bold' style={{fontSize: '17px'}}>
                            <span className='text-[#0077BD]'>{itemContent.lbl_ascensor}</span>&nbsp;<ElevadorIcon title="Ascensor" color={'black'} className='w-[1.6rem] h-[1.6rem]' />
                        </div>
                        <div className='flex font-bold' style={{fontSize: '17px'}}>
                            <span className='text-[#0077BD]'>{itemContent.lbl_calefaccion}</span>&nbsp;<CalefaccionIcon title="Calefacción" color={'black'} className='w-[1.6rem] h-[1.6rem]' />
                        </div>
                        <div className='flex font-bold' style={{fontSize: '17px'}}>
                            <span className='text-[#0077BD]'>{itemContent.lbl_aire_acondicionado}</span>&nbsp;<AireAconIcon title="Aire acondicionado" color={'black'} className='w-[1.6rem] h-[1.6rem]' />
                        </div>
                        <div className='flex font-bold' style={{fontSize: '17px'}}>
                            <span className='text-[#0077BD]'>{itemContent.cp_m2}</span>&nbsp;<AreaMMIcon title="Área" color={'black'} className='w-[1.6rem] h-[1.6rem]' />
                        </div>
                        <div className='flex font-bold' style={{fontSize: '17px'}}>
                            <span className='text-[#0077BD]'>{itemContent.lbl_discapacidad}</span>&nbsp;<BiAccessibility title='Accesibildad discapacidad' size={'1.7rem'} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 mt-4 w-full sm:w-auto">
                        {
                            itemContent.ds_descripcion_camas ? <div><span className='txt-orange-ef8221'>Camas: </span> {itemContent.ds_descripcion_camas}</div>: ''
                        }
                        {
                            itemContent.ds_descripcion_sofacama ? <div><span className='txt-orange-ef8221'>Sofacama: </span> {itemContent.ds_descripcion_sofacama}<br/></div>: ''
                        }
                        {
                            itemContent.bs_descripcion_banios ? <div><span className='txt-orange-ef8221'>Baños: </span> {itemContent.bs_descripcion_banios}<br/></div>: ''
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PisosShareItem

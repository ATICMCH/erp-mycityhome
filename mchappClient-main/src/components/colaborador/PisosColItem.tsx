import React from 'react'
import { BiAccessibility, BiBath, BiBed, BiMale } from 'react-icons/bi'
import { useRouter } from 'next/router'
import { AiFillEnvironment } from 'react-icons/ai'
import ValidationsInstance from '@/client/helpers/Validations'
import { BsDoorClosed } from 'react-icons/bs'
import ElevadorIcon from '../Iconos/ElevadorIcon'
import CalefaccionIcon from '../Iconos/CalefaccionIcon'
import AreaMMIcon from '../Iconos/AreaMMIcon'
import AireAconIcon from '../Iconos/AireAconIcon'
import { IPiso } from '@/client/models/IPiso'
import Link from 'next/link'
import SofaCamaIcon from '../Iconos/SofaCamaIcon'
import usePisoItem from '@/client/hooks/colaborador/usePisoItem'

const PisosColItem = ({ item } : { item: IPiso }) => {
    const router = useRouter()
    const { itemContent, eventMap } = usePisoItem(item)

    const isAlta = String(itemContent.estado).toLowerCase() === 'alta'

    return (
        <div className="w-full h-auto">
        <div className="data-table-row-nopointer grid grid-cols-12 gap-2 p-4 pl-2 text-[#0077BD]">
    
            {/* Dirección */}
            <div className='grid col-span-4'>
                <div className="text-lg">
                    <h5 className="font-bold">
                        <span className='flex text-blue-700'>
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
                    </h5>
                    <div className='text-base'>
                        <span>{itemContent.full_direccion}</span>
                    </div>
                </div>
            </div>

                {/* Detalles */}
                <div className="grid col-span-4 grid-cols-5 gap-2 justify-start">
                    <div className='flex font-bold items-center'>
                        <span className='text-[#0077BD]'>{itemContent.cp_ocupacion_maxima}</span>
                        <BiMale color='black' title='Capacidad' size={'1.5rem'} />
                    </div>
                    <div className='flex font-bold items-center gap-1 pr-2'>
                        <span className='text-[#0077BD]'>{itemContent.ds_nro_dormitorios}</span>
                        <BsDoorClosed color='black' title='Habitaciones' size={'1.5rem'} />
                    </div>
                    <div className='flex font-bold items-center gap-1 pr-2'>
                        <span className='text-[#0077BD]'>{itemContent.ds_nro_camas}</span>
                        <BiBed color='black' title='Camas' size={'1.5rem'} />
                    </div>
                    <div className='flex font-bold items-center gap-1 pr-2'>
                        <span className='text-[#0077BD]'>{itemContent.bs_nro_banios}</span>
                        <BiBath color='black' title='Baños' size={'1.5rem'} />
                    </div>
                    <div className='flex font-bold items-center gap-1 pr-2'>
                        <span className='text-[#0077BD]'>{itemContent.ds_nro_sofacama}</span>
                        <SofaCamaIcon title="Sofacama" color={'black'} className='w-[1.8rem] h-[2rem]' />
                    </div>

                    <div className='flex font-bold items-center gap-1 pr-2'>
                        <span className='text-[#0077BD]'>{itemContent.lbl_ascensor}</span>
                        <ElevadorIcon title="Ascensor" color={'black'} className='w-[1.5rem] h-[1.5rem]' />
                    </div>
                    <div className='flex font-bold items-center gap-1 pr-2'>
                        <span className='text-[#0077BD]'>{itemContent.lbl_calefaccion}</span>
                        <CalefaccionIcon title="Calefacción" color={'black'} className='w-[1.5rem] h-[1.5rem]' />
                    </div>
                    <div className='flex font-bold items-center gap-1 pr-2'>
                        <span className='text-[#0077BD]'>{itemContent.lbl_aire_acondicionado}</span>
                        <AireAconIcon title="Aire acondicionado" color={'black'} className='w-[1.5rem] h-[1.5rem]' />
                    </div>
                    <div className='flex font-bold items-center gap-1 pr-2'>
                        <span className='text-[#0077BD]'>{itemContent.cp_m2}</span>
                        <AreaMMIcon title="Área" color={'black'} className='w-[1.5rem] h-[1.5rem]' />
                    </div>
                    <div className='flex font-bold items-center gap-1 pr-2'>
                        <span className='text-[#0077BD]'>{itemContent.lbl_discapacidad}</span>
                        <BiAccessibility color='black' title='Accesibilidad' size={'1.5rem'} />
                    </div>
                </div>

                {/* Precio */}
                <div className='col-span-2 flex justify-end items-center'>
                    <span className='text-bold text-blue-700 text-[1.3rem]'>
                        €&nbsp;
                        {
                            itemContent.variablesreserva?.length 
                                ? itemContent.variablesreserva[0].total.toFixed(2)
                                : '0.00'
                        }
                    </span>
                </div>

                {/* Disponibilidad */}
                <div className="col-span-2 flex items-center justify-end">
                    <span
                        className={`px-3 py-1 rounded-full text-white font-bold text-sm justify-end inline-flex ${
                            isAlta ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        title={String(itemContent.estado)}
                    >
                        {isAlta ? 'Baja' : 'Alta'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default PisosColItem
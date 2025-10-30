import React from 'react'
import { TbBrandAirbnb, TbBrandBooking, TbBrandBitbucket, TbBrandApple } from 'react-icons/tb'
import{ BiAccessibility, BiBath, BiBed, BiDetail, BiMale } from 'react-icons/bi'
import { useRouter } from 'next/router'
import { MdHomeFilled } from 'react-icons/md'
import { IInfoPisoComercial } from '@/client/models/IInfoPisoComercial'
import Tooltip from '../Tooltip'
import usePisoComercialItem from '@/client/hooks/rmg/pisocomercial/usePisoComercialItem'
import { AiFillEnvironment, AiFillSave, AiOutlineClose, AiOutlineEdit, AiOutlineLink, AiTwotoneEdit } from 'react-icons/ai'
import ValidationsInstance from '@/client/helpers/Validations'
import { BsCardText, BsDoorClosed, BsFillDoorClosedFill, BsPencilFill, BsPencilSquare } from 'react-icons/bs'
import ElevadorIcon from '../Iconos/ElevadorIcon'
import CalefaccionIcon from '../Iconos/CalefaccionIcon'
import AreaMMIcon from '../Iconos/AreaMMIcon'
import AireAconIcon from '../Iconos/AireAconIcon'
import AseoIcon from '../Iconos/AseoIcon'
import SofaCamaIcon from '../Iconos/SofaCamaIcon'
import Link from 'next/link'
import HomelikeIcon from '../Iconos/HomelikeIcon'

const PComercialItem = ({   position, item, statusTooltip, idTooltipSelected, setStatusTooltip, setIdTooltipSelected } : 
                            {
                                position: string,
                                item: IInfoPisoComercial, 
                                statusTooltip: boolean, 
                                idTooltipSelected: string,
                                setStatusTooltip: (value: boolean | ((prevVar: boolean) => boolean)) => void,
                                setIdTooltipSelected: (value: string | ((prevVar: string) => string)) => void
                            }) => {

    const router = useRouter()

    const { saveLinkPlataforma,
            saveLinkPlataformaKeyDown,
            saveEstadoGeneral,
            savePrecioAlquiler,
            savePrecioAlquilerKeyDown,
            savePrecioMueble,
            savePrecioMuebleKeyDown,
            savePrecioLimite,
            savePrecioLimiteKeyDown, 
            handleChangePlataforma,
            changeStatusTootip,
            closeTooltip,
            handleChange, 
            itemContent,
            goEditData,
            eventMap,
            handleChangeRatioLab
        } = usePisoComercialItem(item, setStatusTooltip, setIdTooltipSelected)

    const getIconPlataforma = (codigo: string, valLink: string) => {
        let _isLinkOk = ValidationsInstance.checkUrl(valLink)
        switch(codigo) {
            case 'booking':
                return <div className={`rounded-full ${_isLinkOk?'bg-blue-800':'bg-[#a8a8a8]'} p-1`}><TbBrandBooking title='Booking' /></div>
            case 'airbnb': 
                return <div className={`rounded-full ${_isLinkOk?'bg-blue-800':'bg-[#a8a8a8]'} p-1`}><TbBrandAirbnb title='Airbnb' /></div>
            case 'homelike':
                return <div style={{marginTop: '-35px'}} className={`rounded-full ${_isLinkOk?'bg-blue-800':'bg-[#a8a8a8]'} p-0 w-[1.7rem] h-[1.7rem] text-bold`}><span style={{fontSize: 12}} title='Homelike'>HL</span></div>
            case 'holidu':
                return <div style={{marginTop: '-35px'}} className={`rounded-full ${_isLinkOk?'bg-blue-800':'bg-[#a8a8a8]'} p-0 w-[1.7rem] h-[1.7rem] text-bold`}><span style={{fontSize: 12}} title='Holidu'>HD</span></div>
            case 'muchosol':
                return <div style={{marginTop: '-35px'}} className={`rounded-full ${_isLinkOk?'bg-blue-800':'bg-[#a8a8a8]'} p-0 w-[1.7rem] h-[1.7rem] text-bold`}><span style={{fontSize: 12}} title='Muchosol'>MS</span></div>
            case 'spotahome':
                return <div style={{marginTop: '-35px'}} className={`rounded-full ${_isLinkOk?'bg-blue-800':'bg-[#a8a8a8]'} p-0 w-[1.7rem] h-[1.7rem] text-bold`}><span style={{fontSize: 12}} title='Spotahome'>SH</span></div>
            case 'vrbo':
                return <div style={{marginTop: '-35px'}} className={`rounded-full ${_isLinkOk?'bg-blue-800':'bg-[#a8a8a8]'} p-0 w-[1.7rem] h-[1.7rem] text-bold`}><span style={{fontSize: 12}} title='Vrbo'>VB</span></div>
            case 'uniplaces':
                return <div style={{marginTop: '-35px'}} className={`rounded-full ${_isLinkOk?'bg-blue-800':'bg-[#a8a8a8]'} p-0 w-[1.7rem] h-[1.7rem] text-bold`}><span style={{fontSize: 12}} title='Uniplaces'>UP</span></div>
            case 'housinganywhere':
                return <div style={{marginTop: '-35px'}} className={`rounded-full ${_isLinkOk?'bg-blue-800':'bg-[#a8a8a8]'} p-0 w-[1.7rem] h-[1.7rem] text-bold`}><span style={{fontSize: 10}} title='Housinganywhere'>HAW</span></div>
            default:
                return <MdHomeFilled />
        }
    }

    return (
        <div className={`card-action1 w-full lg:h-[7rem] md:h-[7rem] h-auto rounded-2xl ${ (statusTooltip && idTooltipSelected.includes(position)) ? 'border-2 border-[#0077BD] bg-[#d4efff]' : (itemContent.estado_alquiler_rentable === 'NO')?'bg-red-50 border-2 border-[red]':'bg-[#ffffffc8]' } grid items-center p-5`}>
            <div className="flex flex-wrap gap-9">
                <div className="text-lg">
                    <h3 className='font-bold text-blue-700 text-xl'>
                        <span className='flex'>
                            Piso&nbsp;
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
                    <Tooltip 
                                valDefaultTooltipElement={<><span style={{display: 'flex'}} id={`${position}-piso`}>{itemContent.a_etiqueta}&nbsp;<BiDetail title='Editar' style={{margin: '5px 0px 0px 2px'}} /></span></>}
                                flagTooltip={statusTooltip}
                                updateFlagTooltip={() => changeStatusTootip(`${position}-piso`)}
                                idTT={`${position}-piso`}
                                idTooltipSelected={idTooltipSelected} >
                        <div className='w-full flex space-x-1'>
                            <div className="flex text-sm" style={{display: 'block'}}>
                                <div className="w-[38rem] flex items-center mb-1">
                                    <span style={{fontSize: '16px'}} className='mr-4 w-[90%]'><b className='text-[#0077BD]'>{itemContent.a_etiqueta}</b>: {itemContent.a_full_direccion}</span>
                                    <span className='rounded-full text-white bg-black p-2' onClick={closeTooltip}><AiOutlineClose className='' /></span>  
                                </div>
                                <div className="flex items-center mr-1 space-x-4">
                                    <div className='flex font-bold' style={{fontSize: '16px'}}>
                                        <span className='mt-1 text-[#0077BD]'>{itemContent.cp_ocupacion_maxima}</span><BiMale title='Capacidad' size={'1.5rem'} />
                                    </div>
                                    <div className='flex font-bold' style={{fontSize: '16px'}}>
                                        <span className='mt-1 text-[#0077BD]'>{itemContent.ds_nro_dormitorios}</span>&nbsp;<BsDoorClosed title='Habitaciones' size={'1.5rem'} />
                                    </div>
                                    <div className='flex font-bold' style={{fontSize: '16px'}}>
                                        <span className='mt-1 text-[#0077BD]'>{itemContent.ds_nro_camas}</span>&nbsp;<BiBed title={`Camas, ${itemContent.ds_nro_camas || ''}`} size={'1.5rem'} />
                                    </div>
                                    <div className='flex font-bold' style={{fontSize: '16px'}}>
                                        <span className='mt-1 text-[#0077BD]'>{itemContent.ds_nro_sofacama}</span>&nbsp;<SofaCamaIcon title={`Sofacama, ${itemContent.ds_nro_sofacama || ''}`} color={'black'} className='w-[1.4rem] h-[1.4rem]' />
                                    </div>
                                    <div className='flex font-bold' style={{fontSize: '16px'}}>
                                        <span className='mt-1 text-[#0077BD]'>{itemContent.bs_nro_banios}</span>&nbsp;<BiBath title={`Baños, ${itemContent.bs_nro_banios || ''}`} size={'1.5rem'} />
                                    </div>
                                    <div className='flex font-bold' style={{fontSize: '16px'}}>
                                        <span className='mt-1 text-[#0077BD]'>{itemContent.lbl_ascensor}</span>&nbsp;<ElevadorIcon title="Ascensor" color={'black'} className='w-[1.4rem] h-[1.4rem]' />
                                    </div>
                                    <div className='flex font-bold' style={{fontSize: '16px'}}>
                                        <span className='mt-1 text-[#0077BD]'>{itemContent.lbl_calefaccion}</span>&nbsp;<CalefaccionIcon title="Calefacción" color={'black'} className='w-[1.4rem] h-[1.4rem]' />
                                    </div>
                                    <div className='flex font-bold' style={{fontSize: '16px'}}>
                                        <span className='mt-1 text-[#0077BD]'>{itemContent.lbl_aire_acondicionado}</span>&nbsp;<AireAconIcon title="Aire acondicionado" color={'black'} className='w-[1.4rem] h-[1.4rem]' />
                                    </div>
                                    <div className='flex font-bold' style={{fontSize: '16px'}}>
                                        <span className='mt-1 text-[#0077BD]'>{itemContent.cp_m2}</span>&nbsp;<AreaMMIcon title="Área" color={'black'} className='w-[1.4rem] h-[1.4rem]' />
                                    </div>
                                    <div className='flex font-bold' style={{fontSize: '16px'}}>
                                        <span className='mt-1 text-[#0077BD]'>{itemContent.lbl_discapacidad}</span>&nbsp;<BiAccessibility title='Accesibildad discapacidad' size={'1.5rem'} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 items-center mt-4">
                                    {
                                        itemContent.ds_descripcion_camas ? <div><b>Camas: </b> {itemContent.ds_descripcion_camas}</div>:''
                                    }
                                    {
                                        itemContent.ds_descripcion_sofacama ? <div><b>Sofacama: </b> {itemContent.ds_descripcion_sofacama}<br/></div>:''
                                    }
                                    {
                                        itemContent.bs_descripcion_banios ? <div><b>Baños: </b> {itemContent.bs_descripcion_banios}<br/></div>:''
                                    }
                                </div>
                            </div>
                        </div>
                    </Tooltip>
                </div>
                <div className="text-lg">
                    <h3 className='font-bold text-blue-700 text-xl'>Límite</h3>
                    <Tooltip 
                                valDefaultTooltipElement={<span style={{display: 'flex'}} className = {(itemContent.estado_alquiler_rentable === 'NO') ? 'text-[red] font-bold' : ''}>{`€ ${itemContent.vr_variablereserva?.precio_limite || '0.00'}`}&nbsp;<BsPencilFill size={15} title='Editar' style={{margin: '5px 0px 0px 2px'}} /></span>}
                                flagTooltip={statusTooltip}
                                updateFlagTooltip={() => changeStatusTootip(`${position}-pl`)}
                                idTT={`${position}-pl`}
                                idTooltipSelected={idTooltipSelected} >
                        <div className='w-full flex space-x-1'>
                            <input type="number" name="precio_limite" onChange={handleChange} onKeyDown={savePrecioLimiteKeyDown} value={itemContent.precio_limite_tooltip} placeholder={`Precio límite €`} className="text-sm text-black border border-gray-300 px-2 py-1 w-[10rem]" />
                            <div className='rounded-full text-white bg-black p-2' onClick={savePrecioLimite}><AiFillSave className='' /></div>
                            <div className='rounded-full text-white bg-black p-2' onClick={closeTooltip}><AiOutlineClose className='' /></div>
                        </div>
                    </Tooltip>
                </div>
                <div className="text-lg">
                    <h3 className='font-bold text-blue-700 text-xl'>Estado</h3>
                    <Tooltip 
                                valDefaultTooltipElement={<><span style={{display: 'flex', background: `${itemContent.estado_general === 1?'#c6f1c6':'#f9cccc'}`}} className={`rounded-full px-3`} id={`${position}-status`}>{itemContent.lestado}&nbsp;<BsPencilFill size={15} title='Editar' style={{margin: '5px 0px 0px 2px'}} /></span></>}
                                flagTooltip={statusTooltip}
                                updateFlagTooltip={() => changeStatusTootip(`${position}-status`)}
                                idTT={`${position}-status`}
                                idTooltipSelected={idTooltipSelected} >
                        <div className='w-full flex space-x-1'>
                            <div className="flex text-sm">
                                <div className="w-[5rem] flex items-center mr-4">
                                    <input checked={itemContent.estado_general === 1} onChange={handleChange} type="radio" value="1" name="estado_general" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label onClick={() => handleChangeRatioLab('estado_general', '1')} className="ml-2 text-sm font-medium text-gray-900 text-bold dark:text-gray-300">Activo</label>
                                </div>
                                <div className="w-[8rem] flex items-center mr-4">
                                    <input checked={itemContent.estado_general === 3} onChange={handleChange} type="radio" value="3" name="estado_general" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label onClick={() => handleChangeRatioLab('estado_general', '3')} className="ml-2 text-sm font-medium text-gray-900 text-bold dark:text-gray-300">No disponible</label>
                                </div>
                                <div className="w-[6rem] flex items-center mr-4">
                                    <input checked={itemContent.estado_general === 2} onChange={handleChange} type="radio" value="2" name="estado_general" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label onClick={() => handleChangeRatioLab('estado_general', '2')} className="ml-2 text-sm font-medium text-gray-900 text-bold dark:text-gray-300">Stop Sell</label>
                                </div>
                                <div className="w-[6rem] flex items-center mr-4">
                                    <input checked={itemContent.estado_general === 4} onChange={handleChange} type="radio" value="4" name="estado_general" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label onClick={() => handleChangeRatioLab('estado_general', '4')} className="ml-2 text-sm font-medium text-gray-900 text-bold dark:text-gray-300">Solo CE</label>
                                </div>
                                <div className="w-[6rem] flex items-center mr-4">
                                    <input checked={itemContent.estado_general === 5} onChange={handleChange} type="radio" value="5" name="estado_general" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label onClick={() => handleChangeRatioLab('estado_general', '5')} className="ml-2 text-sm font-medium text-gray-900 text-bold dark:text-gray-300">Solo LE</label>
                                </div>
                                <div className="w-[6rem] flex items-center mr-4">
                                    <input checked={itemContent.estado_general === 6} onChange={handleChange} type="radio" value="6" name="estado_general" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label onClick={() => handleChangeRatioLab('estado_general', '6')} className="ml-2 text-sm font-medium text-gray-900 text-bold dark:text-gray-300">Sale de LE</label>
                                </div>
                                <div className="w-[6rem] flex items-center mr-4">
                                    <input checked={itemContent.estado_general === 7} onChange={handleChange} type="radio" value="7" name="estado_general" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label onClick={() => handleChangeRatioLab('estado_general', '7')} className="ml-2 text-sm font-medium text-gray-900 text-bold dark:text-gray-300">Entra a LE</label>
                                </div>
                            </div>
                            <div className='rounded-full text-white bg-black p-2' onClick={saveEstadoGeneral}><AiFillSave className='' /></div>
                            <div className='rounded-full text-white bg-black p-2' onClick={closeTooltip}><AiOutlineClose className='' /></div>
                        </div>
                    </Tooltip>
                </div>
                <div className="text-lg">
                    <h3 className='font-bold text-blue-700 text-xl'>Alquiler</h3>
                    <Tooltip 
                                valDefaultTooltipElement={<span style={{display: 'flex'}}>{`€ ${itemContent.vr_variablereserva?.precio_alquiler || '0.00'}`}&nbsp;<BsPencilFill size={15} title='Editar' style={{margin: '5px 0px 0px 2px'}} /></span>}
                                flagTooltip={statusTooltip}
                                updateFlagTooltip={() => changeStatusTootip(`${position}-pa`)}
                                idTT={`${position}-pa`}
                                idTooltipSelected={idTooltipSelected} >
                        <div className='w-full flex space-x-1'>
                            <input type="number" name="precio_alquiler" onChange={handleChange} onKeyDown={savePrecioAlquilerKeyDown} value={itemContent.precio_alquiler_tooltip} placeholder={`Precio alquiler €`} className="text-sm text-black border border-gray-300 px-2 py-1 w-[10rem]" />
                            <div className='rounded-full text-white bg-black p-2' onClick={savePrecioAlquiler}><AiFillSave className='' /></div>
                            <div className='rounded-full text-white bg-black p-2' onClick={closeTooltip}><AiOutlineClose className='' /></div>
                        </div>
                    </Tooltip>
                </div>
                <div className="text-lg">
                    <h3 className='font-bold text-blue-700 text-xl'>Muebles</h3>
                    <h4>
                        € {
                        (() => {
                            const precioAlquiler = itemContent.vr_variablereserva?.precio_alquiler || 0;
                            const precioMuebles = Math.tanh((precioAlquiler / 1000 - 2.25)) * 200 + 350 + 50;
                            return Math.ceil(precioMuebles);
                        })()
                        }
                    </h4>
                </div>

                <div className="text-lg">
                    <h3 className='font-bold text-blue-700 text-xl'>Total</h3>
                    <h4 className={(itemContent.estado_alquiler_rentable === 'NO') ? 'text-[red] font-bold' : ''}>
                        € {
                            (() => {
                                const precioAlquiler = itemContent.vr_variablereserva?.precio_alquiler || 0;
                                const precioMuebles = Math.tanh((precioAlquiler / 1000 - 2.25)) * 200 + 350 + 50;
                                return Math.ceil(precioAlquiler + Math.ceil(precioMuebles));
                            })()
                        }
                    </h4>
                </div>

                <div className="text-lg">
                    <h3 className='font-bold text-blue-700 text-xl'>Plataformas</h3>
                    <div className="flex items-end flex-wrap gap-4 text-gray-50">
                        {itemContent.plataformas
                        .filter((platform, index, self) =>
                            index === self.findIndex(p =>
                            p.codigo?.toLowerCase() === platform.codigo?.toLowerCase() &&
                                p.id === platform.id
                                )
                        )
                        .filter(el =>
                            el.nombre?.toLowerCase() !== 'homelike' &&
                            el.codigo?.toLowerCase() !== 'homelike'
                        )
                        .sort((a, b) => {
                            const order = [
                            'spotahome',
                            'housinganywhere',
                            'uniplaces',
                            'booking',
                            'airbnb',
                            'holidu',
                            'muchosol',
                            'vrbo'
                            ];
                            const indexA = order.findIndex(name => a.codigo?.toLowerCase().includes(name));
                            const indexB = order.findIndex(name => b.codigo?.toLowerCase().includes(name));
                            return indexA - indexB;
                        })
                        .map(el => (
                            <Tooltip
                            key={`ptf-${item.idpiso}-${el.id}`}
                            valDefaultTooltipElement={
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                {getIconPlataforma(el.codigo, el.link)}
                                </div>
                            }
                            flagTooltip={statusTooltip}
                            updateFlagTooltip={() => changeStatusTootip(`${position}-ptf-${item.idpiso}-${el.id}`)}
                            idTT={`${position}-ptf-${item.idpiso}-${el.id}`}
                            idTooltipSelected={idTooltipSelected}
                            >
                            <div
                                style={{
                                position: 'absolute',
                                top: '50%',
                                right: '100%',
                                transform: 'translateY(-50%)',
                                marginRight: '8px',
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                padding: '8px',
                                borderRadius: '4px',
                                zIndex: 1000,
                                width: '320px',
                                display: statusTooltip && idTooltipSelected === `${position}-ptf-${item.idpiso}-${el.id}` ? 'flex' : 'none',
                                gap: '0.25rem',
                                alignItems: 'center'
                                }}
                            >
                                <input
                                type="text"
                                name="link"
                                onChange={(e) => handleChangePlataforma(e, el.id)}
                                onKeyDown={(e) => saveLinkPlataformaKeyDown(e, el.id)}
                                value={el.link_tooltip}
                                placeholder={`Link de ${el.nombre}`}
                                className="text-sm text-black border border-gray-300 px-2 py-1 w-full"
                                />
                                <div
                                className='rounded-full bg-black p-2 cursor-pointer'
                                onClick={(e) => saveLinkPlataforma(el.id, e)}
                                style={{ color: 'white' }}
                                >
                                <AiFillSave />
                                </div>
                                <a
                                className='rounded-full bg-black p-2'
                                href={el.link}
                                rel="noopener noreferrer"
                                target='_blank'
                                title={el.nombre}
                                style={{ textDecoration: 'underline', color: 'white' }}
                                >
                                <AiOutlineLink />
                                </a>
                                <div
                                className='rounded-full bg-black p-2 cursor-pointer'
                                onClick={closeTooltip}
                                style={{ color: 'white' }}
                                >
                                <AiOutlineClose />
                                </div>
                            </div>
                            </Tooltip>
                        ))}
                    </div>
                    </div>
                <div onClick={() => goEditData(itemContent.idpiso)} className="text-lg">
                    <h3>&nbsp;</h3>
                    <div className='card-action'>
                        <BsPencilFill className='mt-1' title='Editar' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PComercialItem
import { Layout } from '@/components/Layout'
import { useMemo } from 'react'
import React from 'react'
import { STATES, ALERT_DANGER, STATES_PISO_COMERCIAL } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import ButtonContainer from '@/components/ButtonContainer'
import useApartmentId from '@/client/hooks/rmg/apartments/useApartmentId'
import { AiFillPicture, AiFillSave, AiOutlineMinus, AiOutlinePlus, AiOutlineUser, AiTwotoneCalendar } from 'react-icons/ai'
import PisoComercialContainer from '@/components/PisoComercialContainer'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import FloatButton from '@/components/FloatButton'
import { MdCancel } from 'react-icons/md'
import { BsFillHouseFill, BsFolderSymlinkFill, BsLink45Deg } from 'react-icons/bs'
import SemaforoIcon from '@/components/Iconos/SemaforoIcon'
import AgenteIcon from '@/components/Iconos/AgenteIcon'
import RealidadVirtualIcon from '@/components/Iconos/RealidadVirtualIcon'
import NavegadorIcon from '@/components/Iconos/NavegadorIcon'
import NavegadorVIcon from '@/components/Iconos/NavegadorVIcon'
import PasswordIcon from '@/components/Iconos/PasswordIcon'
import { FaShopify } from 'react-icons/fa'

const ApartmentsById = () => {
    const { dataDB, 
            handleChange, 
            handleSave,
            handleCancel,
            handleAddPlataforma,
            handleDeletePlataforma, 
            errorValidate, 
            msgError,
            listPlataforma } = useApartmentId()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    return (
        <Layout>
            <div className="w-auto min-h-[31rem] grid grid-flow-col">
                <div className="w-[85rem] min-h-[30rem] pl-[6rem] ">
                    <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
                        { errorValidate ?
                            <AlertContainer typeAlert={ALERT_DANGER}>
                                <div dangerouslySetInnerHTML={{ __html: msgError }} />
                            </AlertContainer>:<></>
                        }
                        <input type="hidden" name='id' value={dataDB.id?.toString()} />
                        <div className="min-h-[25rem] grid grid-cols-2 space-x-5">
                            <div className="h-full grid space-y-5">
                                <div className=" min-h-[25rem] bg-[#5da7d5c0] rounded-2xl p-6 space-y-4">
                                    <h1 className='text-lg text-[#0077bd] font-bold'>Información comercial</h1>

                                    <div className='grid'>
                                        <div className=" w-full flex text-sm">
                                            {/* <label className='p-2 h-min w-[14rem] bg-[#0077bd] text-white rounded-l-full col-span-0'>Nombre comercial <span style={{color: 'red', fontSize: 'bold'}}>*</span></label> */}
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <BsFillHouseFill title='Nombre comercial' size={'1.2rem'} />
                                            </label>
                                            <input placeholder='Nombre comercial del piso' type="text" onChange={handleChange} name='nombre_comercial' value={dataDB.nombre_comercial} className="rounded-r-full p-2 w-[100%] col-span-6" />
                                        </div>
                                    </div>

                                    <div className='grid'>
                                        <div className=" w-full flex text-sm">
                                            {/* <label className='p-2 h-min w-[14rem] bg-[#0077bd] text-white rounded-l-full col-span-0'>Link comercial <span style={{color: 'red', fontSize: 'bold'}}>*</span></label> */}
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <BsLink45Deg title='Link Comercial' size={'1.2rem'} />
                                            </label>
                                            <input placeholder='Link de comercial' type="url" onChange={handleChange} name='link_nombre_comercial' value={dataDB.link_nombre_comercial} className="rounded-r-full p-2 w-[100%] col-span-6" />
                                        </div>
                                    </div>

                                    <div className='grid'>
                                        <div className=" w-full flex text-sm">
                                            {/* <label className='p-2 h-min w-[14rem] bg-[#0077bd] text-white rounded-l-full col-span-0'>Estado general <span style={{color: 'red', fontSize: 'bold'}}>*</span></label> */}
                                            
                                            <label className='px-3 py-3 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <SemaforoIcon title="Estado general" color={'white'} className='w-[0.9rem] h-[0.9rem]' />
                                            </label>
                                            
                                            <select value={dataDB.estado_general} onChange={handleChange} name='estado_general' className="rounded-r-full p-2 w-[100%] col-span-6">
                                                { useMemo(() => drawListOnSelect(STATES_PISO_COMERCIAL, 'spc', 'Seleccionar estado'), []) }
                                            </select>
                                        </div>
                                    </div>

                                    <div className='grid'>
                                        <div className=" w-full flex text-sm">
                                            {/* <label className='p-2 h-min w-[14rem] bg-[#0077bd] text-white rounded-l-full col-span-0'>Tour comercial</label> */}
                                            <label className='px-3 py-3 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <RealidadVirtualIcon title="Tour virtual" color={'white'} className='w-[1.4rem] h-[1rem]' />
                                            </label>
                                            <input placeholder='Link de tour virtual' type="url" onChange={handleChange} name='link_tour_virtual' value={dataDB.link_tour_virtual} className="rounded-r-full p-2 w-[100%] col-span-6" />
                                        </div>
                                    </div>

                                    <div className='grid'>
                                        <div className=" w-full flex text-sm">
                                            {/* <label className='p-2 h-min w-[14rem] bg-[#0077bd] text-white rounded-l-full col-span-0'>Disponibilidad</label> */}
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <AiTwotoneCalendar title='Disponibilidad' size={'1.2rem'} />
                                            </label>
                                            <input type="url" placeholder='Link de calendario de disponibilidad' onChange={handleChange} name='link_calendario_disponibilidad' value={dataDB.link_calendario_disponibilidad} className="rounded-r-full p-2 w-[100%] col-span-6" />
                                        </div>
                                    
                                    </div>

                                    <div className='grid'>
                                        <div className=" w-full flex text-sm">
                                            {/* <label className='p-2 h-min w-[14rem] bg-[#0077bd] text-white rounded-l-full col-span-0'>Fotos, videos</label> */}
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <BsFolderSymlinkFill title='Fotos & Videos' size={'1.2rem'} />
                                            </label>
                                            <input type="url" placeholder='Link de fotos y videos' onChange={handleChange} name='link_repositorio' value={dataDB.link_repositorio} className="rounded-r-full p-2 w-[100%] col-span-6" />
                                        </div>
                                    </div>

                                    <div className='grid'>
                                        <div className=" w-full flex text-sm">
                                            {/* <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full mr-3'>Mascota <span style={{color: 'red', fontSize: 'bold'}}>*</span></label> */}
                                            {/* <label className='p-2 h-min w-[10.5rem] bg-[#0077bd] text-white rounded-l-full col-span-0 mr-2'>Tiene anuncio <span style={{color: 'red', fontSize: 'bold'}}>*</span></label> */}
                                            <label className='px-3 py-3 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2 mr-2'>
                                                <NavegadorIcon title="Tiene anuncio" color={'white'} className='w-[1.4rem] h-[1.1rem]' />
                                            </label>
                                            <div className="flex">
                                                <div className="flex items-center mr-4">
                                                    <input checked={dataDB.tiene_anuncio === true} onChange={handleChange} type="radio" value="Si" name="tiene_anuncio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label className="ml-2 text-sm font-medium text-gray-900 text-bold dark:text-gray-300">Si</label>
                                                </div>
                                                <div className="flex items-center mr-4">
                                                    <input checked={dataDB.tiene_anuncio === false} onChange={handleChange} type="radio" value="No" name="tiene_anuncio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label className="ml-2 text-sm font-medium text-gray-900 text-bold dark:text-gray-300">No</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        dataDB.tiene_anuncio ? 
                                        <>
                                            <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3">
                                                <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">Información del anuncio</legend>
                                                <div className='grid'>
                                                    <div className=" w-full flex text-sm">
                                                        {/* <label className='p-2 h-min w-[14rem] bg-[#0077bd] text-white rounded-l-full col-span-0'>Usuario <span style={{color: 'red', fontSize: 'bold'}}>*</span></label> */}
                                                        <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                            <AiOutlineUser title='Usuario' size={'1.2rem'} />
                                                        </label>
                                                        <input type="text" placeholder='Usuario login del anuncio' onChange={handleChange} name='anuncio_usuario' value={dataDB.anuncio_usuario} className="rounded-r-full p-2 w-[100%] col-span-6" />
                                                    </div>
                                                </div>

                                                <div className='grid'>
                                                    <div className=" w-full flex text-sm">
                                                        {/* <label className='p-2 h-min w-[14rem] bg-[#0077bd] text-white rounded-l-full col-span-0'>Contraseña <span style={{color: 'red', fontSize: 'bold'}}>*</span></label> */}
                                                        <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                            <PasswordIcon title="Contraseña" color={'white'} className='w-[1.4rem] h-[1rem]' />
                                                        </label>
                                                        <input type="text" placeholder='Contreseña login del anuncio' onChange={handleChange} name='anuncio_contrasenia' value={dataDB.anuncio_contrasenia} className="rounded-r-full p-2 w-[100%] col-span-6" />
                                                    </div>
                                                </div>

                                                <div className='grid'>
                                                    <div className=" w-full flex text-sm">
                                                        {/* <label className='p-2 h-min w-[14rem] bg-[#0077bd] text-white rounded-l-full col-span-0'>Plataforma <span style={{color: 'red', fontSize: 'bold'}}>*</span></label> */}
                                                        <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                            <NavegadorVIcon title="Nombre plataforma" color={'white'} className='w-[1.4rem] h-[1rem]' />
                                                        </label>
                                                        <input type="text" placeholder='Nombre plataforma del anuncio' onChange={handleChange} name='anuncio_plataforma' value={dataDB.anuncio_plataforma} className="rounded-r-full p-2 w-[100%] col-span-6" />
                                                    </div>
                                                </div>

                                                <div className='grid'>
                                                    <div className=" w-full flex text-sm">
                                                        {/* <label className='p-2 h-min w-[14rem] bg-[#0077bd] text-white rounded-l-full col-span-0'>Link plataforma <span style={{color: 'red', fontSize: 'bold'}}>*</span></label> */}
                                                        <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                            <BsLink45Deg title='Link plataforma' size={'1.2rem'} />
                                                        </label>
                                                        <input type="url" placeholder='Link de acceso a plataforma del anuncio' onChange={handleChange} name='anuncio_link' value={dataDB.anuncio_link} className="rounded-r-full p-2 w-[100%] col-span-6" />
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </>
                                        : ''
                                    }
                                </div>
                            </div>

                            {
                                true ? 
                                    <div className="h-full grid space-y-5">
                                        <PisoComercialContainer data={dataDB} title='Información del piso' />
                                    </div>
                                    : 
                                    <div className="h-full grid space-y-5">
                                <PisoComercialContainer data={dataDB} title='Información del piso' />

                                <div className="min-h-[20rem] bg-[#5da7d5c0] rounded-2xl p-6 space-y-4">
                                    <h1 className='text-lg text-[#0077bd] font-bold'>Plataformas comerciales</h1>

                                    <div className="w-full grid grid-cols-1 text-sm">
                                        <div className="w-[100%] flex">
                                            <label className='p-2 h-min w-[12rem] bg-[#0077bd] text-white rounded-l-full'>Plataforma <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                                            <select value={dataDB.l_idplataforma} onChange={handleChange} name='l_idplataforma' className="p-1 w-[8rem]">
                                                { drawListOnSelect(listPlataforma, 'lp', 'Seleccionar')}
                                            </select>
                                            <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white col-span-2'>Link <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                                            <input className="h-min rounded-r-full1 p-2 w-[35rem] outline-blue-800" onChange={handleChange} value={dataDB.l_link} type="url" name='l_link' />
                                            <div onClick={handleAddPlataforma} className="bg-blue col-span-2 rounded-r-full flex items-center justify-end px-2 w-[3rem]">
                                                <AiOutlinePlus className='text-white cursor-pointer' size={'1.2rem'} />
                                            </div>
                                        </div>
                                    </div>

                                    <hr />

                                    <div className="space-y-2">
                                    {
                                        dataDB.plataformas.length === 0 ? '' : (
                                            dataDB.plataformas.map((el, index) => (
                                                <div className=" w-[100%] flex text-xs" key={`pc-${index}`}>
                                                    <label className='p-2 h-auto min-w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2 text-center'>
                                                        <a style={{textDecoration:'underline'}} className='underline-offset-2' href={el.link} rel="noopener noreferrer" target='_blank' title={el.nombre}>{el.nombre}</a>
                                                    </label>
                                                    <div className="rounded-r-full p-2 px-2 w-[100%] h-[100%] bg-white flex justify-between">
                                                        <p className='text-wraper w-[90%]'>{el.link}</p>
                                                        <div onClick={() => handleDeletePlataforma(el.id.toString())} className="h-full flex items-center w-[1.5rem]">
                                                            <AiOutlineMinus className='text-[#0077bd] cursor-pointer' size={'1rem'} />
                                                        </div> 
                                                    </div>
                                                </div>
                                            ))
                                        )
                                    }
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
                <ButtonContainerVertical>
                    <FloatButton title='Guardar' handler={handleSave} Icon={AiFillSave} />
                    <FloatButton title='Cancelar' handler={handleCancel} Icon={MdCancel} />
                </ButtonContainerVertical>
            </div>
        </Layout>
    )
}

export default ApartmentsById
import { Layout } from '@/components/Layout'
import { useMemo } from 'react'
import React from 'react'
import { ALERT_DANGER } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import FloatButton from '@/components/FloatButton'
import { AiFillEuroCircle, AiFillSave, AiOutlineCalendar, AiOutlineComment, AiOutlineFieldTime, AiOutlinePercentage, AiOutlineUser } from 'react-icons/ai'
import { MdCancel } from 'react-icons/md'
import { BsCalendar3, BsFileEarmarkCheckFill, BsFileEarmarkExcelFill, BsFillHouseFill } from 'react-icons/bs'
import { BiTask, BiTaskX, BiTimer } from 'react-icons/bi'
import { FaTrashAlt } from 'react-icons/fa'
import useLimitePrecioId from '@/client/hooks/rmg/limiteprecio/useLimitePrecioId'
import SemaforoIcon from '@/components/Iconos/SemaforoIcon'
import PropietarioIcon from '@/components/Iconos/PropietarioIcon'

const LimitePrecioId = () => {
    const { dataDB, 
            handleChange, 
            handleSave,
            handleCancel,
            errorValidate, 
            msgError } = useLimitePrecioId()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    return (
        <Layout>
            <div className="w-auto min-h-[10rem] grid grid-flow-col">
                <div className="w-[80rem] w-min-[80rem] min-h-[10rem] pl-[6rem] ">
                    <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
                        { errorValidate ?
                            <AlertContainer typeAlert={ALERT_DANGER}>
                                <div dangerouslySetInnerHTML={{ __html: msgError }} />
                            </AlertContainer>:<></>
                        }
                        <input type="hidden" name='id' value={dataDB.id?.toString()} />

                        <div className="min-h-[10rem] grid grid-cols-1n space-x-5">
                            <div className="h-full grid space-y-2">
                                <div className=" min-h-[18rem] bg-[#5da7d5c0] rounded-2xl p-6 space-y-3">
                                    <h1 className='text-lg text-[#0077bd] font-bold'>Solicitud limite precio</h1>
                                    <div className='grid grid-cols-2 space-x-3'>
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineCalendar title='Fecha solicitud' size={'1.2rem'} />
                                                </span>
                                            </label>
                                            <input  placeholder='Fecha solicitud'
                                                    disabled 
                                                    type="text" 
                                                    name='f_fecha_creacion' 
                                                    value={dataDB.f_fecha_creacion} 
                                                    className="font-bold rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                        
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <SemaforoIcon title="Estado" color={'white'} className='w-[1rem] h-[1rem]' />
                                                </span>
                                            </label>
                                            <input  placeholder='Estado solicitud'
                                                    disabled 
                                                    type="text" 
                                                    name='lbl_estado_solicitud' 
                                                    value={dataDB.lbl_estado_solicitud} 
                                                    className="font-bold rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 space-x-3'>
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <BsFillHouseFill title='Piso' size={'1.2rem'} />
                                                </span>
                                            </label>
                                            <input  placeholder='Vivienda'
                                                    disabled 
                                                    type="text" 
                                                    name='piso' 
                                                    value={dataDB.piso} 
                                                    className="font-bold rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                        
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <PropietarioIcon title="Propietario" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                                </span>
                                            </label>
                                            <input  placeholder='Propietario'
                                                    disabled 
                                                    type="text" 
                                                    name='propietario' 
                                                    value={dataDB.propietario} 
                                                    className="font-bold rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 space-x-3'>
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiFillEuroCircle title='Limite precio' size={'1.3rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='Limite precio'
                                                    onChange={handleChange}
                                                    type="number" 
                                                    name='limite_precio' 
                                                    value={dataDB.limite_precio} 
                                                    className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                        
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlinePercentage title="% Limite precio" color={'white'} size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='% Limite precio'
                                                    onChange={handleChange}
                                                    type="number" 
                                                    name='porcentaje_limite_precio' 
                                                    value={dataDB.porcentaje_limite_precio} 
                                                    className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 space-x-3'>
                                        <div className="w-full flex text-sm">
                                            <label className='px-4 py-2 h-auto w-[3.0rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineComment title='Observaciones' size={'1.5rem'} />
                                                </span>
                                            </label>
                                            <textarea placeholder='Ingresar obervaciones adicionales' defaultValue={dataDB.observacion} onChange={handleChange} className="rounded-r-full p-3 w-[100%] outline-blue-800" name="observacion"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ButtonContainerVertical>
                    {
                        ( dataDB.estado_solicitud === 1 ) ? 
                            <>
                                <FloatButton title="Aprobar" handler={() => handleSave('aprobar')} Icon={BiTask} />
                                <FloatButton title="Rechazar" handler={() => handleSave('rechazar')} Icon={BiTaskX} />
                            </> : ''
                    }
                    <FloatButton title='Cancelar' handler={handleCancel} Icon={MdCancel} />
                </ButtonContainerVertical>
                {/* </div> */}
            </div>
        </Layout>
    )
}

export default LimitePrecioId
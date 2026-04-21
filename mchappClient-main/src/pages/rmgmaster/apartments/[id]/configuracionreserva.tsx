import { Layout } from '@/components/Layout'
import React from 'react'
import { ALERT_DANGER, STATES_APLICA_COMERCIAL, STATES_ESTADO_RMG_COMERCIAL, STATES_PISO_COMERCIAL } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import ButtonContainer from '@/components/ButtonContainer'
import PisoComercialContainer from '@/components/PisoComercialContainer'
import useApartmentIdConfigReserva from '@/client/hooks/rmg/apartments/useApartmentIdConfigReserva'
import CardVarReservaContainer from '@/components/CardVarReservaContainer'
import { useRouter } from 'next/router'

const ApartmentsByIdConfigReserva = () => {
    const router = useRouter()
    const { id } = router.query
    
    const { dataDB,
            listTipoEstancia,
            handleChange,
            handleSave,
            handleDeleteConfigReserva,
            handleAddConfigReserva,
            errorValidate,
            msgError } = useApartmentIdConfigReserva()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    const handleCancel = () => {
        router.push('/rmgmaster/apartments')
    }

    return (
        <Layout>
            <div className="w-full min-h-[45rem] px-[6rem] ">
                <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
                    { errorValidate ?
                        <AlertContainer typeAlert={ALERT_DANGER}>
                            <div dangerouslySetInnerHTML={{ __html: msgError }} />
                        </AlertContainer>:<></>
                    }
                    <input type="hidden" name='id' value={dataDB.id?.toString()} />
                    <div className="h-full grid space-y-5">
                        <div className="h-full grid space-y-5">
                            <PisoComercialContainer data={dataDB} title='Información del piso' />
                        </div>
                        { dataDB.id?.toString() === '0' ?
                            <div className="h-full grid space-y-5">
                                <div className="min-h-[4rem] bg-[#5da7d5c0] rounded-2xl p-6 space-y-4">
                                    <h1 className='text-lg text-[#0077bd] font-bold'>Información comercial</h1>
                                    <p className='text-bold'>Por favor, ingresar la información comercial del piso antes de trabajar en esta sección!!</p>
                                </div>
                            </div> 
                            :
                            <div className="h-full grid space-y-5">
                                <div className="min-h-[20rem] bg-[#5da7d5c0] rounded-2xl p-6 space-y-4">
                                    <h1 className='text-lg text-[#0077bd] font-bold'>Información comercial</h1>

                                    <div className='grid grid-cols-4'>
                                        <div className=" w-full flex text-sm">
                                            <label className='p-2 h-min w-[14rem] bg-[#0077bd] text-white rounded-l-full col-span-0'>Estado general <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                                            <select value={dataDB.estado_general} onChange={handleChange} name='estado_general' className="rounded-r-full p-2 w-[100%] col-span-6">
                                                { drawListOnSelect(STATES_PISO_COMERCIAL, 'spc', 'Seleccionar estado') }
                                            </select>
                                        </div>
                                    </div>

                                    <div className="w-full text-left h-[2rem] bg-[#0077bd] text-white px-3 rounded-full text-sm grid items-center">Configuración de reserva</div>

                                    <div className='grid grid-cols-4 space-x-2'>
                                        <div className=" w-full flex text-sm">
                                            <label className='p-2 h-auto w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-1'>Aplica <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                                            <select value={dataDB.vr_variablereserva?.aplica} onChange={handleChange} name='vr_variablereserva.aplica' className="rounded-r-full p-2 w-[50%] col-span-0">
                                                { drawListOnSelect(STATES_APLICA_COMERCIAL, 'vra', 'Seleccionar aplica') }
                                            </select>
                                        </div>
                                        <div className=" w-full flex text-sm">
                                            <label className='p-2 h-auto w-[6rem] bg-[#0077bd] text-white rounded-l-full'>Estado <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                                            <select disabled value={dataDB.vr_variablereserva?.estado} name='vr_variablereserva.estado' className="rounded-r-full p-2 w-[50%] col-span-0">
                                                { drawListOnSelect(STATES_ESTADO_RMG_COMERCIAL, 'vre', 'Seleccionar') }
                                            </select>
                                        </div>
                                        <div className=" w-full flex text-sm">
                                            <label className='p-2 h-auto w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-1'>Fecha inicio vig.</label>
                                            <input disabled={!(dataDB.vr_variablereserva?.aplica == 'Despues')} value={dataDB.vr_variablereserva?.fecha_inicio_vigencia} onChange={handleChange} type="date" name='vr_variablereserva.fecha_inicio_vigencia' className="rounded-r-full p-2 w-[50%] outline-blue-800" />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-4 space-x-2'>
                                        <div className=" w-full flex text-sm">
                                            <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Precio base</label>
                                            <input placeholder='0.00 €' value={ dataDB.vr_variablereserva?.precio_base === -2 ? '' : dataDB.vr_variablereserva?.precio_base} onChange={handleChange} type="number" name='vr_variablereserva.precio_base' className="rounded-r-full p-2 w-[50%] outline-blue-800" />
                                        </div>
                                        <div className=" w-full flex text-sm">
                                            <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Descuento</label>
                                            <input placeholder='0 %' value={dataDB.vr_variablereserva?.porcentaje_descuento === -2 ? '' : dataDB.vr_variablereserva?.porcentaje_descuento} onChange={handleChange} type="number" name='vr_variablereserva.porcentaje_descuento' className="rounded-r-full p-2 w-[50%] outline-blue-800" />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-4 space-x-2'>
                                        <div className=" w-full flex text-sm">
                                            <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>P. alquiler <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                                            <input placeholder='0.00 €' value={dataDB.vr_variablereserva?.precio_alquiler === -2 ? '' : dataDB.vr_variablereserva?.precio_alquiler} onChange={handleChange} type="number" name='vr_variablereserva.precio_alquiler' className="rounded-r-full p-2 w-[50%] outline-blue-800" />
                                        </div>
                                        <div className=" w-full flex text-sm">
                                            <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>P. muebles <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                                            <input placeholder='0.00 €' value={dataDB.vr_variablereserva?.precio_muebles === -2 ? '' : dataDB.vr_variablereserva?.precio_muebles} onChange={handleChange} type="number" name='vr_variablereserva.precio_muebles' className="rounded-r-full p-2 w-[50%] outline-blue-800" />
                                        </div>
                                        <div className=" w-full flex text-sm">
                                            <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Total <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                                            <input disabled placeholder='0.00 €' value={dataDB.vr_variablereserva?.total === -2 ? '' : dataDB.vr_variablereserva?.total} onChange={handleChange} type="number" name='vr_variablereserva.total' className="rounded-r-full p-2 w-[50%] outline-blue-800" />
                                        </div>
                                        <div className=" w-full flex text-sm">
                                            <button onClick={handleAddConfigReserva} className='flex bg-[#0077bd] text-white px-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>+ Agregar</button>
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-4 space-x-2'>
                                        <div className=" w-full flex text-sm">
                                            <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Estancia <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                                            <select value={dataDB.vr_variablereserva?.idtipoestancia} onChange={handleChange} name='vr_variablereserva.idtipoestancia' className="rounded-r-full p-2 w-[50%] col-span-0">
                                                { drawListOnSelect(listTipoEstancia, 'lte', 'Seleccionar') }
                                            </select>
                                        </div>
                                        <div className=" w-full flex text-sm">
                                            <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Duración <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                                            <input disabled={!(dataDB.vr_variablereserva?.idtipoestancia != -2)} placeholder='nro meses / días' value={dataDB.vr_variablereserva?.duracion_estancia === -2 ? '' : dataDB.vr_variablereserva?.duracion_estancia} onChange={handleChange} type="number" name='vr_variablereserva.duracion_estancia' className="rounded-r-full p-2 w-[50%] outline-blue-800" />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-4 space-x-2'>
                                        <div className="w-full flex text-sm">
                                            <label className='p-2 h-min1 w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Edad <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                                            <input placeholder='Mín' className="h-min p-2 w-[4rem] outline-blue-800 col-span-3" onChange={handleChange} value={dataDB.vr_variablereserva?.edad_min === -2 ? '':dataDB.vr_variablereserva?.edad_min} type="number" name='vr_variablereserva.edad_min' />
                                            <label className='p-2 h-min w-[2rem] bg-[#0077bd] text-white text-center col-span-1'>a</label>
                                            <input placeholder='Máx' className="h-min rounded-r-full p-2 w-[4rem] outline-blue-800 col-span-3" onChange={handleChange} value={dataDB.vr_variablereserva?.edad_max === -2? '':dataDB.vr_variablereserva?.edad_max} type="number" name='vr_variablereserva.edad_max' />
                                        </div>

                                        <div className=" w-full flex text-sm">
                                            <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full mr-3'>Mascota <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                                            <div className="flex">
                                                <div className="flex items-center mr-4">
                                                    <input checked={dataDB.vr_variablereserva?.mascota === true} onChange={handleChange} type="radio" value="Si" name="vr_variablereserva.mascota" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label className="ml-2 text-sm font-medium text-gray-900 text-bold dark:text-gray-300">Si</label>
                                                </div>
                                                <div className="flex items-center mr-4">
                                                    <input checked={dataDB.vr_variablereserva?.mascota === false} onChange={handleChange} type="radio" value="No" name="vr_variablereserva.mascota" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label className="ml-2 text-sm font-medium text-gray-900 text-bold dark:text-gray-300">No</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full flex text-sm">
                                        <label className='py-4 px-2 h-auto w-[6rem] bg-[#0077bd] text-white rounded-l-full'>Comentario</label>
                                        {/* <textarea defaultValue={dataDB.vr_variablereserva?.observacion} onChange={handleChange} className="rounded-r-full p-3 w-[38%] outline-blue-800" name="vr_variablereserva.observacion"></textarea> */}
                                        <textarea className="rounded-r-full p-3 w-[38%] outline-blue-800"  onChange={handleChange} value={dataDB.vr_variablereserva?.observacion} name="vr_variablereserva.observacion" />
                                    </div>

                                    {/* <ButtonContainer>
                                        <button onClick={handleAddConfigReserva} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>+ Agregar</button>
                                    </ButtonContainer> */}
                                    
                                    <hr />
                                    <hr />

                                    <CardVarReservaContainer data={dataDB.variablesreserva} />
                                </div>
                            </div>
                        }
                    </div>
                    <br />
                    <br />
                    <ButtonContainer>
                        {   dataDB.variablesreserva.length === 0 ? '' :
                                <button disabled={dataDB.variablesreserva.length === 0} onClick={handleSave} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Guardar</button>
                        }
                        <button onClick={handleCancel} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Cancelar</button>
                    </ButtonContainer>
                </div>
            </div>
        </Layout>
    )
}

export default ApartmentsByIdConfigReserva
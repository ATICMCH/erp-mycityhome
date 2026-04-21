import React, { useState, useEffect } from 'react'
import PComercialList from './PComercialList'
import PComercialGroupedList from './PComercialGroupedList' // NUEVO IMPORT
import usePisoComercial from '@/client/hooks/rmg/pisocomercial/usePisoComercial'
import SpinnerCustom from '../SpinnerCustom'
import { BsDoorClosed } from 'react-icons/bs'
import { BiBath, BiBed, BiEuro, BiMale } from 'react-icons/bi'
import ElevadorIcon from '../Iconos/ElevadorIcon'
import SemaforoIcon from '../Iconos/SemaforoIcon'
import ReactPaginate from 'react-paginate'
import usePiso from '@/client/hooks/colaborador/usePiso'
import PisosColList from '../colaborador/PisosColList'

const PComercialContainer = () => {
    
    const [isGroupedView, setIsGroupedView] = useState(false)

    const { listData, 
            filterFields, 
            loading, 
            pageCurrent,
            total,
            limit,
            changeSearch, 
            handleKeyDown,
            handleActionSearch,
            handlerOnPage,
            setNeedsLocation } = usePisoComercial()

    // AGREGAR este useEffect DESPUÉS de las declaraciones
    useEffect(() => {
        setNeedsLocation(isGroupedView)
    }, [isGroupedView, setNeedsLocation])

    return (
        <div className="w-[80rem] h-auto grid grid-flow-row">
            <div className="flex grid-flow-row1 items-center col-span-x-2 w-full h-[6rem] bg-[#badaed] p-1">
                
                {/* AGREGAR EL BOTÓN AQUÍ */}

                <div className="flex w-auto items-center justify-start h-full text-sm mr-4">
                    <label className='p-2 h-[2.2rem] w-[2.5rem] bg-[#e8edef] border border-[#212529] text-white rounded-l-full col-span-2'>
                        <SemaforoIcon title="Estado" color={'black'} className='w-[1rem] h-[1rem]' />
                    </label>
                    <select className="h-[2.2rem] border border-l-0 border-[#212529] rounded-r-full p-2 w-[100%]" value={filterFields.estado_general} onChange={changeSearch} name='estado_general'>
                        <option value='-2'>Estado?</option>
                        <option value='1'>Activo</option>
                        <option value='3'>No disponible</option>
                        <option value='2'>Stop sell</option>
                        <option value='4'>Solo CE</option>
                        <option value='5'>Solo LE</option>
                        <option value='6'>Sale de LE</option>
                        <option value='7'>Entra a LE</option>
                    </select>
                </div>
                <div className="flex w-auto items-center justify-start h-full text-sm">                        
                    <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#e8edef] border border-[#212529] text-red rounded-l-full col-span-2'>
                        <BiMale title='Capacidad máxima' size={'1.2rem'} />
                    </label>
                    <input  placeholder='Nro...' 
                            type="number" 
                            onChange={changeSearch}
                            onKeyDown={handleKeyDown} 
                            name='cp_ocupacion_maxima' 
                            value={filterFields.cp_ocupacion_maxima < 0 ? '' : filterFields.cp_ocupacion_maxima} 
                            className="rounded-r-full px-1 h-[2.2rem] w-[40%] border border-l-0 border-[#212529] col-span-6" />
                </div>
                <div className="flex w-auto items-center justify-end1 h-full text-sm">                        
                    <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#e8edef] border border-[#212529] text-red rounded-l-full col-span-2'>
                        <BsDoorClosed title='Nro habitaciones' size={'1.2rem'} />
                    </label>
                    <input  placeholder='Nro...' 
                            type="number" 
                            onChange={changeSearch}
                            onKeyDown={handleKeyDown} 
                            name='ds_nro_dormitorios' 
                            value={filterFields.ds_nro_dormitorios < 0 ? '' : filterFields.ds_nro_dormitorios} 
                            className="rounded-r-full px-1 h-[2.2rem] w-[40%] border border-l-0 border-[#212529] col-span-6" />
                </div>

                <div className="flex w-auto items-center justify-end1 h-full text-sm">                        
                    <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#e8edef] border border-[#212529] text-red rounded-l-full col-span-2'>
                        <BiBed title='Nro camas' size={'1.2rem'} />
                    </label>
                    <input  placeholder='Nro...' 
                            type="number" 
                            onChange={changeSearch} 
                            onKeyDown={handleKeyDown}
                            name='ds_nro_camas' 
                            value={filterFields.ds_nro_camas < 0 ? '' : filterFields.ds_nro_camas} 
                            className="rounded-r-full px-1 h-[2.2rem] w-[40%] border border-l-0 border-[#212529] col-span-6" />
                </div>

                <div className="flex w-auto items-center justify-end1 h-full text-sm">                        
                    <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#e8edef] border border-[#212529] text-red rounded-l-full col-span-2'>
                        <BiBath title='Nro baños' size={'1.2rem'} />
                    </label>
                    <input  placeholder='Nro...' 
                            type="number" 
                            onChange={changeSearch}
                            onKeyDown={handleKeyDown} 
                            name='bs_nro_banios' 
                            value={filterFields.bs_nro_banios < 0 ? '' : filterFields.bs_nro_banios} 
                            className="rounded-r-full px-1 h-[2.2rem] w-[40%] border border-l-0 border-[#212529] col-span-6" />
                </div>

                <div className="flex w-auto items-center justify-end1 h-full text-sm">                        
                    <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#e8edef] border border-[#212529] text-red rounded-l-full col-span-2'>
                        <BiEuro title='Total' size={'1.2rem'} />
                    </label>
                    <input  placeholder='T. min' 
                            type="number" 
                            onChange={changeSearch}
                            onKeyDown={handleKeyDown} 
                            name='total_start' 
                            value={filterFields.total_start < 0 ? '' : filterFields.total_start} 
                            className="rounded-r-full12 px-1 h-[2.2rem] w-[19%] border border-l-0 border-r-0 border-[#212529] col-span-6" />
                    <label className='px-2 py-2 h-[2.2rem] w-[1.9rem] bg-[#e8edef] border border-[#212529] text-red rounded-l-full123 col-span-2'>
                    </label>
                    <input  placeholder='T. max' 
                            type="number" 
                            onChange={changeSearch}
                            onKeyDown={handleKeyDown} 
                            name='total_end' 
                            value={filterFields.total_end < 0 ? '' : filterFields.total_end} 
                            className="rounded-r-full px-1 h-[2.2rem] w-[20%] border border-l-0 border-[#212529] col-span-6" />
                </div>

                {/* <div className="flex w-auto items-center justify-end1 h-full text-sm">                        
                    <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#e8edef] border border-[#212529] text-red rounded-l-full col-span-2'>
                        <ElevadorIcon title='Elevador' className='w-[1.4rem] h-[1.4rem]' />
                    </label>
                    <input  placeholder='Nro...' 
                            type="number" 
                            onChange={changeSearch} 
                            name='nro_habitaciones' 
                            value={filterFields.nro_habitaciones} 
                            className="rounded-r-full px-1 h-[2.2rem] w-[40%] col-span-6" />
                </div> */}

                <div className="flex items-center justify-end h-full">
                    <span className='font-bold mr-3'>Buscar:</span>
                    <input  placeholder='Buscar...' 
                            className='rounded-lg text-sm text-black border border-l-0 border-[#212529] px-2 py-1 w-[12rem] h-[2.2rem]' 
                            type="text"
                            name='search_all' 
                            value={filterFields.search_all} 
                            onChange={changeSearch} 
                            onKeyDown={handleKeyDown}
                    />
                </div>
                <hr />
            </div>
            
            <div>
                {
                    loading ? 
                        <div className='text-blue text-center flex justify-center'><SpinnerCustom /></div> 
                        :
                        ( 
                            listData.length === 0 ? 
                                <div className='text-black text-center flex justify-center'><b>No hay registros <span>&#128549; &#128549;</span>!!</b></div>
                                : 
                                // AMBAS VISTAS IGUALES - SIEMPRE AGRUPADAS
                                <PComercialGroupedList items={listData} />
                        )
                }
                
                {/* Paginación */}
                {!isGroupedView && (
                    <div className={`w-full mt-1 grid rounded-b-2xl h-auto pagination-content items-center bg-[#f7f7f7]`}>
                        <ReactPaginate
                            forcePage={pageCurrent}
                            activeClassName={'item active '}
                            breakClassName={'item break-me '}
                            breakLabel={'...'}
                            containerClassName={'pagination'}
                            disabledClassName={'disabled-page'}
                            marginPagesDisplayed={2}
                            nextClassName={"item next "}
                            nextLabel=">"
                            onPageChange={ (e) => handlerOnPage(e) }
                            pageCount={ Math.ceil(total/limit)}
                            pageClassName={'item pagination-page '}
                            pageRangeDisplayed={limit}
                            previousClassName={"item previous"}
                            previousLabel="<"
                            renderOnZeroPageCount={null}
                        /> 
                    </div>
                )}
            </div>
        </div>
    )
}

export default PComercialContainer
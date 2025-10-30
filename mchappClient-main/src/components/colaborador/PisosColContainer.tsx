import React, { useState } from 'react'
import PisosColList from './PisosColList'
import usePiso from '@/client/hooks/colaborador/usePiso'
import SpinnerCustom from '../SpinnerCustom'
import ReactPaginate from 'react-paginate'
import { BiBath, BiBed, BiEuro, BiMale } from 'react-icons/bi'

const PisosColContainer = () => {
    
    const { listData,
            filterFields, 
            loading, 
            pageCurrent,
            total,
            limit,
            changeSearch, 
            handleKeyDown,
            handleActionSearch,
            handlerOnPage } = usePiso()

    const ciudadValue = (filterFields.ciudad || '').toLowerCase()

    // Separar pisos en Madrid y Sol y filtrar si hay ciudad escrita
    const pisosMadrid = listData
        .filter(piso => piso.ciudad === 'Madrid')
        .filter(piso => piso.ciudad.toLowerCase().includes(ciudadValue))

    const pisosSol = listData
        .filter(piso => piso.ciudad === 'Marbella')
        .filter(piso => piso.ciudad.toLowerCase().includes(ciudadValue))

    return (
        <div className="w-[80rem] h-auto grid grid-flow-row">
            
            {/* Filtros */}
            <div className="flex grid-flow-row-1 items-center col-span-x-2 w-full h-[6rem] bg-[#badaed] p-1">
                
                <div className="flex w-auto items-center justify-start h-full text-sm">                        
                    <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#0077bd] border border-[#0077bd] text-red rounded-l-full col-span-2'>
                        <BiMale color='white' title='Capacidad máxima' size={'1.2rem'} />
                    </label>
                    <input  placeholder='Nro...' 
                            type="number" 
                            onChange={changeSearch}
                            onKeyDown={handleKeyDown} 
                            name='cp_ocupacion_maxima' 
                            value={filterFields.cp_ocupacion_maxima < 0 ? '' : filterFields.cp_ocupacion_maxima} 
                            className="rounded-r-full px-1 h-[2.2rem] w-[60%] outline-blue-800 col-span-6" />
                </div>

                <div className="flex w-auto items-center justify-end1 h-full text-sm">                        
                    <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#0077bd] border border-[#0077bd] text-red rounded-l-full col-span-2'>
                        <BiBed color='white' title='Nro habitaciones' size={'1.2rem'} />
                    </label>
                    <input  placeholder='Nro...' 
                            type="number" 
                            onChange={changeSearch}
                            onKeyDown={handleKeyDown} 
                            name='ds_nro_dormitorios' 
                            value={filterFields.ds_nro_dormitorios < 0 ? '' : filterFields.ds_nro_dormitorios} 
                            className="rounded-r-full px-1 h-[2.2rem] w-[60%] outline-blue-800 col-span-6" />
                </div>

                <div className="flex w-auto items-center justify-end1 h-full text-sm">                        
                    <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#0077bd] border border-[#0077bd] text-red rounded-l-full col-span-2'>
                        <BiBath color='white' title='Nro baños' size={'1.2rem'} />
                    </label>
                    <input  placeholder='Nro...' 
                            type="number" 
                            onChange={changeSearch}
                            onKeyDown={handleKeyDown} 
                            name='bs_nro_banios' 
                            value={filterFields.bs_nro_banios < 0 ? '' : filterFields.bs_nro_banios}  
                            className="rounded-r-full px-1 h-[2.2rem] w-[60%] outline-blue-800 col-span-6" />
                </div>

                <div className="flex w-[20rem] items-center justify-end h-full text-sm mr-8 pr-[3px]">                        
                    <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#0077bd] border border-[#0077bd] rounded-l-full col-span-2'>
                        <BiEuro color='white' title='Total' size={'1.2rem'} />
                    </label>
                    <input  title='Total minimo'
                            placeholder='T. min' 
                            type="number" 
                            onChange={changeSearch}
                            onKeyDown={handleKeyDown} 
                            name='total_start' 
                            value={filterFields.total_start < 0 ? '' : filterFields.total_start} 
                            className="rounded-r-full12 px-1 h-[2.2rem] w-[30%] outline-blue-800 col-span-6" />
                    <label className='px-2 py-2 h-[2.2rem] w-[1.9rem] bg-[#0077bd] border border-[#0077bd] text-white text-bold rounded-l-full123 col-span-2'>
                    </label>
                    <input  title='Total maximo'
                            placeholder='T. max' 
                            type="number" 
                            onChange={changeSearch}
                            onKeyDown={handleKeyDown} 
                            name='total_end' 
                            value={filterFields.total_end < 0 ? '' : filterFields.total_end} 
                            className="rounded-r-full px-1 h-[2.2rem] w-[30%] outline-blue-800 col-span-6" />
                </div>

                {/* Campo de búsqueda por ciudad */}
                <div className="flex items-center pr-[15px] h-full">
                    <input
                        placeholder='Madrid/Marbella'
                        className='rounded-full text-sm border-[#212529] px-2 py-1 w-[10rem] h-[2.2rem]'
                        type="text"
                        name='ciudad'
                        value={filterFields.ciudad || ''}
                        onChange={changeSearch}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className="flex items-center justify-end h-full">
                    <input  placeholder='Buscar...' 
                            className='rounded-full text-sm text-black border border1-[#212529] px-2 py-1 w-[20rem] h-[2.2rem]' 
                            type="text"
                            name='search_all' 
                            value={filterFields.search_all} 
                            onChange={changeSearch} 
                            onKeyDown={handleKeyDown}
                    />
                </div>
            </div>

            <div className="grid grid-cols-10 p-2 pl-2 text-bold text-white bg-[#0077BD]">
                <div className="grid col-span-4"><span className='flex'>Nombre</span></div>
                <div className="grid col-span-4 pr-[10px]"><span className='flex pr-[70px]'>Detalles</span></div>
                <div className="grid col-span-1"><span className='grid justify-center'>Total</span></div>
                <div className="grid col-span-1"><span className='grid justify-end pr-[5px]'>Estado</span></div>
            </div>

            {loading ? 
                <div className='text-blue text-center flex justify-center pt-2 pb-2'><SpinnerCustom /></div> 
                :
                (
                    <>
                        {(!filterFields.ciudad || filterFields.ciudad.toLowerCase().includes('madrid')) && (
                            <>
                                <div className="bg-[#e2ecf3] px-4 py-2 text-blue font-bold text-md text-center">MADRID</div>
                                {pisosMadrid.length === 0 ? (
                                    <div className='text-black text-center py-2'><b>No hay pisos en Madrid</b></div>
                                ) : (
                                    <PisosColList items={pisosMadrid} />
                                )}
                            </>
                        )}

                        {/* Espaciador */}
                        {(!filterFields.ciudad && pisosMadrid.length > 0 && pisosSol.length > 0) && (
                            <div className="w-full h-14 bg-transparent" />
                        )}

                        {(!filterFields.ciudad || filterFields.ciudad.toLowerCase().includes('sol') || filterFields.ciudad.toLowerCase().includes('marbella')) && (
                            <>
                                <div className="bg-[#e2ecf3] px-4 py-2 text-blue font-bold text-md text-center">SOL</div>
                                {pisosSol.length === 0 ? (
                                    <div className='text-black text-center py-2'><b>No hay pisos en Sol</b></div>
                                ) : (
                                    <PisosColList items={pisosSol}/>
                                )}
                            </>
                        )}
                    </>
                )
            }

            <div className={`w-full grid rounded-b-2xl h-auto pagination-content items-center bg-[#f7f7f7]`}>
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
                    pageCount={Math.ceil(total/limit)}
                    pageClassName={'item pagination-page '}
                    pageRangeDisplayed={limit}
                    previousClassName={"item previous"}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                /> 
            </div>
        </div>
    )
}

export default PisosColContainer
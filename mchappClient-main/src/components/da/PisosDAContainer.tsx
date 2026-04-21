import React, { useState, useEffect } from 'react'
import SpinnerCustom from '../SpinnerCustom'
import { BsDoorClosed } from 'react-icons/bs'
import { BiBath, BiBed, BiEuro, BiMale } from 'react-icons/bi'
import usePisoDA from '@/client/hooks/da/pisos/usePisoDA'
import PisosDAList from './PisosDAList'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import ReactPaginate with no SSR
const ReactPaginate = dynamic(() => import('react-paginate'), { 
    ssr: false,
    loading: () => <div>Loading...</div>
})

const PisosDAContainer = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { listData, 
            filterFields, 
            loading, 
            pageCurrent,
            total,
            limit,
            changeSearch, 
            handleKeyDown,
            handleActionSearch,
            handlerOnPage } = usePisoDA()

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="w-full max-w-[80rem] mx-auto px-2 sm:px-4 h-auto flex flex-col">
            <SpinnerCustom />
        </div>;
    }

    return (
        <div className="w-full max-w-[80rem] mx-auto px-2 sm:px-4 h-auto flex flex-col">
            <div className="flex flex-col sm:flex-row justify-end w-full py-3 sm:py-4 rounded-t-2xl bg-[#badaed] px-2 sm:px-4">
                <div className="flex items-center justify-end w-full gap-2 sm:gap-4">
                    <input  
                        placeholder='Buscar...' 
                        className='flex-1 rounded-lg text-sm text-black border px-3 py-2 h-[2.2rem] max-w-md' 
                        type="text"
                        name='search_all' 
                        value={filterFields.search_all} 
                        onChange={changeSearch} 
                        onKeyDown={handleKeyDown}
                    />
                    <div className="w-px h-8 bg-gray-300 hidden sm:block" />
                    <Link 
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl bg-[#0077bd] text-white hover:bg-[#0066a3] transition-colors" 
                        href='/da/apartments/new'
                    >
                        Nuevo
                    </Link>
                </div>
            </div>

            <div className="w-full">
                {
                    loading ? 
                        <div className='flex justify-center py-8'><SpinnerCustom /></div> 
                        :
                        ( 
                            listData.length === 0 ? 
                                <div className='flex justify-center py-8 text-black font-medium'>
                                    No hay registros <span className="ml-2">&#128549; &#128549;</span>!!
                                </div>
                                : 
                                <PisosDAList items={listData} />
                        )
                }
                <div className="w-full mt-1 rounded-b-2xl bg-[#f7f7f7] py-2 sm:py-4 px-2 sm:px-4">
                    <ReactPaginate
                        forcePage={pageCurrent}
                        activeClassName={'item active'}
                        breakClassName={'item break-me'}
                        breakLabel={'...'}
                        containerClassName={'pagination flex flex-wrap justify-center gap-1 sm:gap-2'}
                        disabledClassName={'disabled-page opacity-50'}
                        marginPagesDisplayed={1}
                        nextClassName={"item next"}
                        nextLabel=">"
                        onPageChange={handlerOnPage}
                        pageCount={Math.ceil(total/limit)}
                        pageClassName={'item pagination-page'}
                        pageRangeDisplayed={window.innerWidth < 640 ? 1 : limit}
                        previousClassName={"item previous"}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                    /> 
                </div>
            </div>
        </div>
    )
}

export default PisosDAContainer
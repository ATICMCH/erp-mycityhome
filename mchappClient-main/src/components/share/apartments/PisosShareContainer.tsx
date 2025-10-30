import React from 'react'
import SpinnerCustom from '../../SpinnerCustom'
import { BsDoorClosed } from 'react-icons/bs'
import { BiBath, BiBed, BiEuro, BiMale } from 'react-icons/bi'
import usePisoShare from '@/client/hooks/share/apartments/usePisoShare'
import PisosShareList from './PisosShareList'
import { IPiso } from '@/client/models/IPiso'
import ReactPaginate from 'react-paginate'

const PisosShareContainer = () => {
    const { listData, 
            filterFields, 
            loading, 
            pageCurrent,
            total,
            limit,
            changeSearch, 
            handleKeyDown,
            handleActionSearch,
            handlerOnPage } = usePisoShare()

    // Agrupar pisos por ciudad (Madrid, Sol, etc.)
    const groupedData = React.useMemo(() => {
        const groups: { [key: string]: IPiso[] } = {}
        listData.forEach((piso) => {
            let ciudad = piso.ciudad || 'Sin especificar'
            if (ciudad.toLowerCase() === 'marbella') ciudad = 'Sol'
            if (!groups[ciudad]) groups[ciudad] = []
            groups[ciudad].push(piso)
        })
        return groups
    }, [listData])

    return (
        <div className="w-full max-w-[80rem] mx-auto px-4 h-auto grid grid-flow-row gap-4">
            <div className="flex justify-end w-full h-[6rem] rounded-t-2xl border-2 border-blue-700 bg-[#badaed] p-1">
                <div className="flex items-center justify-end h-full w-full max-w-[22rem]">
                    <input  
                        placeholder='Buscar...'
                        className='rounded-lg text-sm text-black border border-[#212529] px-2 py-1 w-full h-[2.2rem]'
                        type="text"
                        name='search_all'
                        value={filterFields.search_all}
                        onChange={changeSearch}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>

            <div className="w-full">
                {
                    loading ?
                        <div className='text-blue text-center flex justify-center'><SpinnerCustom /></div>
                        :
                        (
                            listData.length === 0 ?
                                <div className='text-black text-center flex justify-center'><b>No hay registros <span>&#128549; &#128549;</span>!!</b></div>
                                :
                                Object.entries(groupedData).map(([ciudad, pisos]) => (
                                    <div key={ciudad} className="mb-8">
                                        <div className="bg-blue-100 p-4 rounded-lg border-b-2 border-blue-300">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-xl font-bold text-blue-800">📍 {ciudad}</h2>
                                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">{pisos.length} pisos</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4 mt-4">
                                            <PisosShareList items={pisos} />
                                        </div>
                                    </div>
                                ))
                        )
                }

                <div className="w-full mt-1 grid rounded-b-2xl h-auto pagination-content items-center bg-[#f7f7f7]">
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
                        onPageChange={(e) => handlerOnPage(e)}
                        pageCount={Math.ceil(total / limit)}
                        pageClassName={'item pagination-page '}
                        pageRangeDisplayed={limit}
                        previousClassName={"item previous"}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                    />
                </div>
            </div>
        </div>
    )
}

export default PisosShareContainer

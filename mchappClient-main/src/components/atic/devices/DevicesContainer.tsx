import React from 'react'
import SpinnerCustom from '../../SpinnerCustom'
import Link from 'next/link'
import ReactPaginate from 'react-paginate'
import useDevice from '@/client/hooks/atic/devices/useDevice'
import DevicesList from './DevicesList'

const DevicesContainer = () => {
  const {
    pageCurrent,
    listData,
    filterFields,
    loading,
    changeSearch,
    handleKeyDown,
    total,
    limit,
    handlerOnPage,
    handleActionSearch,
  } = useDevice()

  return (
    <div className="w-full max-w-[80rem] mx-auto p-4 grid gap-4">

      {/* Encabezado */}
      <div className="w-full bg-[#badaed] border border-blue rounded-t-3xl p-4 grid gap-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <h1 className="text-2xl font-bold text-blue">Dispositivos</h1>
          <Link
            className="px-4 py-2 rounded-xl bg-[#0077bd] border border-blue text-white text-base"
            href="/atic/devices/new"
          >
            Nuevo
          </Link>
        </div>

        {/* Filtro */}
        <div className="flex justify-end">
          <div className="flex items-center space-x-2 w-full max-w-md">
            <input
              placeholder="Buscar..."
              className="rounded-full text-sm text-black border border-[#212529] px-4 py-2 flex-grow"
              type="text"
              name="search_all"
              value={filterFields.search_all}
              onChange={changeSearch}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleActionSearch}
              className="bg-[#0077bd] text-white px-4 py-2 rounded-xl border border-blue text-base"
              type="submit"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de encabezados */}
      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-8 p-2 text-white bg-[#0077BD] rounded-t-xl font-semibold text-sm text-center">
          <div className="col-span-2 text-left pl-4">Código</div>
          <div className="col-span-1">Nombre</div>
          <div className="col-span-2">Piso</div>
          <div className="col-span-2">Observación</div>
          <div className="col-span-1 hidden md:block">{/* Espacio para acciones */}</div>
        </div>
      </div>

      {/* Lista de resultados */}
      {loading ? (
        <div className="text-blue text-center py-4 flex justify-center">
          <SpinnerCustom />
        </div>
      ) : listData.length === 0 ? (
        <div className="table-empty text-black text-center py-4 font-bold">
          No hay registros <span>&#128549; &#128549;</span>!!
        </div>
      ) : (
        <DevicesList items={listData} />
      )}

      {/* Paginación */}
      <div className="w-full grid rounded-b-2xl bg-[#f7f7f7] p-4 items-center">
        <ReactPaginate
          forcePage={pageCurrent}
          activeClassName="item active"
          breakClassName="item break-me"
          breakLabel="..."
          containerClassName="pagination flex justify-center space-x-2"
          disabledClassName="disabled-page"
          marginPagesDisplayed={2}
          nextClassName="item next"
          nextLabel=">"
          onPageChange={handlerOnPage}
          pageCount={Math.ceil(total / limit)}
          pageClassName="item pagination-page"
          pageRangeDisplayed={limit}
          previousClassName="item previous"
          previousLabel="<"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  )
 }

export default DevicesContainer;
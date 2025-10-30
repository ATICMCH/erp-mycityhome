import React, { useState } from 'react'
import SpinnerCustom from '../../SpinnerCustom'
import Link from 'next/link'
import ReactPaginate from 'react-paginate'
import ReportDeviceList from './ReportDeviceList'
import useReportDevice from '@/client/hooks/aticmaster/reportdevice/useReportDevice'

import * as XLSX from 'xlsx'
import { IPiso } from '@/client/models/IPiso'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import { DA_APARTMENT_PATH } from '@/client/helpers/constants'

const ReportDeviceContainer = () => {
  const {
    pageCurrent,
    listData,
    filterFields,
    loading,
    changeSearch,
    handleKeyDown,
    total,
    limit,
    flagFilter,
    loadingScreen,
    handlerOnPage,
    handleActionSearch,
    handlerReportNew,
    handlerReportLeadNew,
  } = useReportDevice()

  const [items, setItems] = useState([])
  const [errors, setErrors] = useState<Array<any>>([])

  const readExcel = (file: File) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)
      fileReader.onload = (e: any) => {
        const bufferArray = e.target.result
        const wb = XLSX.read(bufferArray, { type: 'buffer' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws)
        resolve(data)
      }
      fileReader.onerror = error => {
        reject(error)
      }
    })

    promise.then((d: any) => {
      setItems(d)
      setErrors([])
    })
  }

  const handleBulk = async () => {
    let _dataInit = {
      id: 0,
      pais: 'España',
      ciudad: 'Madrid',
      codigo_postal: 'XXXXX',
      direccion: '',
      nro_edificio: '',
      nro_piso: '',
      id_dispositivo_ref: undefined,
      ubicacion_mapa: '',
      observaciones: '',
      estado: 1,
      etiqueta: '',
      idpropietario: 0,
      propietarios: [],
      ds_descripcion_camas: '',
      bs_descripcion_banios: '',
      ds_descripcion_sofacama: '',
      if_clase: '',
      if_vista: '',
      plano: '',
      if_zonas: '',
      if_tipo: '',
      co_clase_cocina: '',
      co_tipo_cocina: '',
      co_tipo_cafetera: '',
      ah_tipo_tv: '',
      ah_tipo_internet: '',
      ca_ubicacion_calefaccion: '',
      ca_tipo_calefaccion: '',
    }

    if (items.length !== 0) {
      let errores: Array<any> = []
      for (let i = 0; i < items.length; i++) {
        let _dataExcel = items[i] as IPiso
        _dataExcel = {
          ..._dataInit,
          ..._dataExcel,
          id_dispositivo_ref: `${_dataExcel.etiqueta}_${i}`,
        }
        await FetchApiServiceInstance.create(DA_APARTMENT_PATH, _dataExcel, err => {
          const { status, data } = err.response!
          if (status !== 200) {
            let _d = data as {
              error: string
              data: Array<{ type: string; code: string; field: string; msg: string; label?: string }>
            }
            errores.push({ etiqueta: _dataExcel.etiqueta, data: _d })
          }
        })
      }
      if (errores.length !== 0) setErrors(errores)
    } else alert('Sin registros a migrar!!!')
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 h-auto grid grid-flow-row gap-4">

      <div className="w-full h-auto bg-[#badaed] border border-blue rounded-t-3xl p-2">
        <div className="w-full pt-4 flex flex-wrap justify-between items-center space-y-2 md:space-y-0 md:space-x-2">
          <div className="flex-grow">
            <h1 className="text-lg md:text-2xl font-bold text-blue">Reportes</h1>
          </div>
          <div className="flex flex-shrink-0 space-x-2">
            <button
              onClick={handlerReportNew}
              disabled={loadingScreen ?? false}
              className="px-2 py-1 text-sm md:text-base rounded-xl bg-[#0077bd] border border-blue text-white"
            >
              Nuevo
            </button>
            {loadingScreen !== undefined && loadingScreen && <SpinnerCustom msn="" />}
          </div>
          <div className="flex flex-shrink-0 space-x-2">
            <button
              onClick={handlerReportLeadNew}
              disabled={loadingScreen ?? false}
              className="px-2 py-1 text-sm md:text-base rounded-xl bg-[#0077bd] border border-blue text-white"
            >
              R. Leads
            </button>
            {loadingScreen !== undefined && loadingScreen && <SpinnerCustom msn="" />}
          </div>
        </div>

        <div className="w-full mt-4">
          <h2 className="text-md font-semibold mb-2">Bulk pisos temporal</h2>
          <input
            type="file"
            className="mb-2"
            onChange={(e: any) => {
              const file = e.target.files[0]
              readExcel(file)
            }}
          />
          <button
            onClick={handleBulk}
            name="btn_upload_pisos"
            className="block mt-2 px-2 py-1 text-sm md:text-base rounded-xl bg-[#0077bd] border border-blue text-white"
          >
            Subir pisos ({items.length})
          </button>

          {errors.length > 0 && (
            <div className="mt-4 space-y-2">
              {errors.map((el, index) => (
                <div key={index} className="text-red-600">
                  <strong>{index} :: </strong>
                  {JSON.stringify(el)}
                  <hr />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-6 p-2 text-sm font-bold text-white bg-[#0077BD]">
          <div><span className="ml-1">ID</span></div>
          <div className="col-span-2"><span>Fecha</span></div>
          <div className="col-span-2"><span>Ejecución</span></div>
          <div><span className="text-right">&nbsp;</span></div>
        </div>

        {loading ? (
          <div className="text-blue text-center py-2">
            <SpinnerCustom />
          </div>
        ) : listData.length === 0 ? (
          <div className="text-black text-center py-4">
            <b>No hay registros <span>😢 😢</span>!!</b>
          </div>
        ) : (
          <ReportDeviceList items={listData} />
        )}

        <div className="w-full rounded-b-2xl bg-[#f7f7f7] py-4">
          <ReactPaginate
            forcePage={pageCurrent}
            activeClassName={'item active'}
            breakClassName={'item break-me'}
            breakLabel={'...'}
            containerClassName={'pagination'}
            disabledClassName={'disabled-page'}
            marginPagesDisplayed={2}
            nextClassName={'item next'}
            nextLabel=">"
            onPageChange={e => handlerOnPage(e)}
            pageCount={Math.ceil(total / limit)}
            pageClassName={'item pagination-page'}
            pageRangeDisplayed={limit}
            previousClassName={'item previous'}
            previousLabel="<"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
    </div>
  )
}

export default ReportDeviceContainer

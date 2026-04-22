import React, { useState } from 'react'
import { IDevice } from '@/client/models/IDevice'
import { RiMacbookFill } from "react-icons/ri"
import { TbShield } from "react-icons/tb"
import { CiBatteryFull } from "react-icons/ci"
import axios from 'axios'

const DeviceLockForm = ({ data, handleChange }: { data: IDevice, handleChange: (e: any) => void }) => {
    
    const [vigenciaDias, setVigenciaDias] = useState<number>(7);
    const [codigoGenerado, setCodigoGenerado] = useState<string | null>(null);
    const [isLoadingCode, setIsLoadingCode] = useState<boolean>(false);
    const [codeError, setCodeError] = useState<string | null>(null);

    const handleGenerateWeLockCode = async () => {
        // Aquí mantenemos la seguridad: validamos que el dispositivo exista en BD antes de llamar a la API
        if (!data?.id || !data?.idpiso) {
            setCodeError("Primero debes guardar este dispositivo y asegurarte de que esté asignado a un piso.");
            return;
        }

        setIsLoadingCode(true);
        setCodeError(null);
        setCodigoGenerado(null);

        try {
            const dateStart = new Date();
            const dateEnd = new Date(dateStart.getTime() + vigenciaDias * 24 * 60 * 60 * 1000);

            const response = await axios.post(`/api/public/apartments/${data.idpiso}/devices/${data.id}/handles`, {
                dateStart: dateStart.toISOString(),
                dateEnd: dateEnd.toISOString(),
                seed: data.codigo_permanente || data.mac || "" 
            });

            if (!response.data.error) {
                setCodigoGenerado(response.data.data.code);
            } else {
                setCodeError(response.data.msg || "Error al generar el código");
            }
        } catch (err: any) {
            console.error("Error conectando con la API:", err);
            setCodeError("Error de comunicación con el servidor.");
        } finally {
            setIsLoadingCode(false);
        }
    };

    return (
        <div className="flex flex-col w-full">
            {/* 1. TU DISEÑO ORIGINAL DE 3 COLUMNAS */}
            <div className='grid grid-cols-3 space-x-2'>
                <div className=" w-full flex text-sm">
                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full flex items-center justify-center'>
                        <RiMacbookFill title='MAC' size={'1.2rem'} />
                    </label>
                    <input placeholder='MAC' value={data.mac || ''} onChange={handleChange} type="text" name='mac' className="border border-gray-300 border-l-0 rounded-r-full p-2 w-[85%] outline-blue-800" />
                </div>
                <div className=" w-full flex text-sm">
                    <label className='px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full flex items-center justify-center'>
                        <TbShield title='Codigo Permanente' size={'1.2rem'} />
                    </label>
                    <input placeholder='Codigo Permanente' value={data.codigo_permanente || ''} onChange={handleChange} type="text" name='codigo_permanente' className="border border-gray-300 border-l-0 rounded-r-full p-2 w-[85%] outline-blue-800" />
                </div>
                <div className=" w-full flex text-sm">
                    <label className='px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full flex items-center justify-center'>
                        <CiBatteryFull title='Bateria' size={'1.2rem'} />
                    </label>
                    <input placeholder='Bateria' value={data.bateria || ''} onChange={handleChange} type="number" name='bateria' className="border border-gray-300 border-l-0 rounded-r-full p-2 w-[85%] outline-blue-800" />
                </div>
            </div>

            {/* 2. GENERADOR DE CÓDIGO WE-LOCK EN LÍNEA (SIEMPRE VISIBLE AHORA) */}
            <div className="bg-white p-5 rounded-md border border-gray-200 mt-6 shadow-sm w-full">
                <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                    Generador Matemático de Código (Offline)
                </h3>

                <div className="flex items-end gap-4 mb-2">
                    <div className="w-1/3">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Vigencia en días
                        </label>
                        <input
                            type="number"
                            min="1"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-blue-800"
                            value={vigenciaDias}
                            onChange={(e) => setVigenciaDias(parseInt(e.target.value) || 1)}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleGenerateWeLockCode}
                        disabled={isLoadingCode}
                        className="bg-[#2ea24c] hover:bg-[#25823c] text-white text-sm font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 h-[38px] flex items-center"
                    >
                        {isLoadingCode ? "Calculando..." : "Generar Código"}
                    </button>
                </div>

                {codeError && (
                    <div className="mt-3 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-200">
                        {codeError}
                    </div>
                )}

                {codigoGenerado && (
                    <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">CÓDIGO VÁLIDO PARA LA PUERTA</p>
                        <p className="text-3xl font-bold tracking-[0.25em] text-[#0077bd]">
                            {codigoGenerado}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DeviceLockForm
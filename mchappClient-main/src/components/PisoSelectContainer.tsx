import Link from 'next/link'
import React from 'react'

const PisoSelectContainer = () => {
    return (

        <div className="w-full h-[60vh] grid items-center justify-items-center">
            <div className="lg:w-[60vw] md:w-[90vw] w-[95vw] h-[30rem] bg-[#ffffff4b] rounded-3xl shadow-2xl grid grid-rows-6">
                <div className="row-span-3 grid justify-center">
                    <img src="/img/ico/LogoWhite.svg" className='pt-4 c-logo-login' style={{ width: 200 }} />
                </div>
                
                <div className="row-span-1">
                    <p className='text-center font-bold'>Piso - vivienda</p>
                </div>

                <div className="row-span-1 px-[10vw]">
                    <select name='idrol' className="form-control c-rounded-large c-form-input font-weight-bold p-4 text-center" defaultValue={'Seleccione un piso'}>
                        <option value={''}>Seleccione un piso</option>

                    </select>
                </div>

                <div className="flex justify-center w-full h-full space-x-4">
                    <Link className="p-2 h-min rounded-xl bg-[#0077bd] hover:bg-[#0077bd] text-white" href='/crm/gestionpiso/1'>Gestionar Piso</Link>
                    {/* <Link className="p-2 h-min rounded-xl bg-[#0077bd] text-white" href='/'>Ver detalles</Link> */}
                </div>
            </div>
        </div>

    )
}

export default PisoSelectContainer
import React from 'react'
import { BiMapAlt, BiMapPin } from 'react-icons/bi'
import { BsFillHouseFill } from 'react-icons/bs'
import { useRouter } from 'next/router'

const InventarioHeader = ({pisoId}:{pisoId : number}) => {

    const router = useRouter()
    
    //console.log(id)

    return(
        
        <div className="ml-5 w-auto min-h-[3rem] grid grid-flow-col bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">

            <div className = "w-[10rem] min-h-[3rem] grid grid-flow-col"> <BsFillHouseFill title='Nombre del piso' size={'1.5rem'} /><p>{pisoId}</p></div>

            <div className="w-[10rem] min-h-[3rem] grid grid-flow-col"><BiMapAlt title='Dirección' size={'1.5rem'} /><p>Dirección del piso</p></div>

        </div>
  
    )
}

export default InventarioHeader
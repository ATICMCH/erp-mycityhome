import React, { useContext } from "react";
import { Layout } from "../Layout";
import usePisoId from "@/client/hooks/da/pisos/usePisoId";
import ContentContainer from "../ContentContainer";
import UserContext from "@/client/context/UserContext";

const PisosDAManten = () => {
    
    return(    
            <div className=" min-h-[25rem] bg-[#5da7d5c0] rounded-2xl p-2 space-y-3">
                <fieldset className="grid border border-solid border-gray-300 p-4 space-y-3 mb-4 rounded-lg">
                    <legend className='text-lg text-[#0077bd] font-bold'>Mantenimiento de Pisos</legend>
                    <div className='block items-center justify-center w-full'>
                        <div className='w-full flex text-sm mb-4'>
                            <label className='px-2 py-2 h-auto w-[5.0rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                <span className='display-icon-error'>
                                Campo 1 
                                </span>
                            </label>
                            <input placeholder='Acción realizada 1' type="text" name='campo1' className="rounded-r-full p-2 w-[80%] border" />
                        </div>
                        <div className="w-full flex text-sm mb-4">    
                            <label className='px-2 py-2 h-auto w-[5.0rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                <span className='display-icon-error'>
                                Campo 2 
                                </span>
                            </label>
                            <input placeholder='Acción realizada 2' type="text" name='campo2' className="rounded-r-full p-2 w-[80%] border" />
                        </div>
                        <div className="w-full flex text-sm mb-4">   
                            <label className='px-2 py-2 h-auto w-[5.0rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                <span className='display-icon-error'>
                                Campo 3 
                                </span>
                            </label>
                            <input placeholder='Acción realizada 3' type="text" name='campo3' className="rounded-r-full p-2 w-[80%] border" />
                        </div>
                        <div className="w-full flex text-sm mb-4">   
                            <label className='px-2 py-2 h-auto w-[5.0rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                <span className='display-icon-error'>
                                Campo 4 
                                </span>
                            </label>
                            <input placeholder='Acción realizada 4' type="text" name='campo4' className="rounded-r-full p-2 w-[80%] border" />
                        </div>
                        <div className="w-full flex text-sm mb-4">   
                            <label className='px-2 py-2 h-auto w-[5.0rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                <span className='display-icon-error'>
                                Campo 5 
                                </span>
                            </label>
                            <input placeholder='Acción realizada 5' type="text" name='campo5' className="rounded-r-full p-2 w-[80%] border" />
                        </div>
                    </div>
                </fieldset>
            </div>         
    )
}
export default PisosDAManten;
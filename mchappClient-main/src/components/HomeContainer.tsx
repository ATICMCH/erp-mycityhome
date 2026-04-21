import { pdfVisibility } from '@/client/helpers/constants';
import UserContext from '@/client/context/UserContext'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import { user,rolenum  } from "@/client/types/globalTypes"
import React, { useContext, useState, useEffect } from 'react'

import { useRouter } from "next/router"

import dynamic from "next/dynamic"
import AccesoDirectoContainer from './AccesoDirectoContainer'
import UtilCustomInstance from '@/client/helpers/UtilCustom'
const DeviceStateReportPDF = dynamic(()=>import("@/components/pdf/reportes/atic/devicesstate/DeviceStateReport"),{ssr:false})

const HomeContainer = ( { data, children }: { data?:user, children?: any } ) => {
    const { userData, changeCurrentRol, getCurrentRol } = useContext(UserContext)
    const [userLogin, setUserLogin] = useState<user>({} as user)
    const [roleCurrent, setRoleCurrent] = useState<string>('')
    // Por ahora vamos a colocar aqui, pero deberia estar mejor organizado
    const [lastReport, setLastReport] = useState<any>()

    const router = useRouter()

    /**
     * Cambio de roles para los super admins
     * @param coderole 
     */
    const handlerChangeRoleDiego = async (coderole: string) => {
        await changeCurrentRol(coderole)
        setRoleCurrent( coderole )
        router.push(`/${coderole}`)
    }
    
    useEffect(() => {
        setUserLogin( userData() )
        setRoleCurrent( getCurrentRol() )
        let statusHttpUS = 200
        // Llamada al API REST
        FetchApiServiceInstance.getSingleData(`/api/share/reportdevices/lastreport/`, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _data = (data as Array<any>)
                setLastReport({ ..._data })
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
            //setLoading(false)
        })
    }, [])

    useEffect(() => {
        console.log('user OK: ', userLogin)
    }, [userLogin])
    const canShowPdf = () => {
        // Ruta actual (sin query)
        const path = router.pathname;
        // Roles permitidos para esta ruta
        const allowed = pdfVisibility[path] || [];
        // Si no hay definición, interpretamos como “ninguna restricción”
        if (allowed.length === 0) return true;
        // Si alguno de los roles del usuario coincide
        return userLogin.roles.some((r: any) => allowed.includes(r.id as rolenum));
    };
    return (
        <div className="w-full hx-[40vh] grid items-center justify-items-center1">
            <div className="lg:w-[80rem] w-[90vw] h-min-[35rem] h-auto bg-[#ffffff4b] rounded-3xl shadow-2xl grid grid-rows-6-xx">
                <div className=" row-span-2 grid">
                    <div className=" flex flex-col items-center mt-10">
                        <h1 className="text-lg flex text-[#0077bd]">Bienvenido&nbsp;<b>{userLogin.nombre_completo}</b></h1>
                    </div>
                    <div className=" flex flex-col items-center mt-2 mb-10">
                        <div className="w-[80%] grid items-centermm xl:grid-cols-6 justify-center grid-col-1 justify-items-center">
                            {/* Cosas en comun con otros perfiles */}
                            {
                                userLogin.multilogin ? 
                                <div key={`card-${2000}`} 
                                className="card-acceso-directo-xxx h-min text-[1rem] rounded-xl border border-green-600 text-white mt-3">
                                    <div key={`card-${2001}`} className="w-[10rem] h-[12rem] bg-green-50 rounded-xl shadow-sm grid grid-rows-3">
                                        <div className="row-span-3 grid items-center justify-items-center-xx">
                                            <div className=" flex flex-col items-center space-y-2">
                                                {
                                                    (userLogin.roles.length !== 0) ? 
                                                    <>
                                                        {
                                                            userLogin.roles.sort((a, b) => a.id.localeCompare(b.id)).map((el, index) => {
                                                                let classStr = el.id.toLocaleLowerCase() === roleCurrent ? 'text-white bg-[#0077BD] text-bold rounded-2xl px-2 py-1':'text-[#0077bd]'
                                                                return <span onClick={() => handlerChangeRoleDiego(el.id)} className={`text-xs style-pointer text-bold ${classStr}`} key={`roles-${index}`}>{UtilCustomInstance.getLabelRoleMultiLogin(el.id) }</span>
                                                            })  
                                                        }
                                                    </>
                                                    : ''
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div> : ''
                            }
                            {
                            lastReport && canShowPdf() && (
                                <DeviceStateReportPDF
                                idReport={lastReport.id}
                                dateReport={lastReport.onlydate}
                                typeShow="ad"
                                />
                            )
                            }
                            {/* <AccesoDirectoContainer coderol={`${(userLogin.roles ? userLogin.roles[0] : {}).id}`}  /> */}
                            <AccesoDirectoContainer coderol={`${roleCurrent || 'na'}`}  />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeContainer
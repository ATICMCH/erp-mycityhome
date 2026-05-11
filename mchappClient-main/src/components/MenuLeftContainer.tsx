/* eslint-disable react-hooks/exhaustive-deps */
import { MenuLeftType } from "@/client/types/globalTypes"
import { PropBox } from "./Layout"
import { useContext, useState, useEffect } from "react"
import UserContext from "@/client/context/UserContext"
import { useRouter } from 'next/router'
import { api } from '../client/helpers/Util'
import Link from 'next/link'
import WebMCH24 from "./webMCH24"
import FilterInstance from "@/client/helpers/Filter"
import FichajeBoton from "./FichajeBoton"
import AsistenciasModal from "./rrhh/fichaje/AsistenciasModal" 

const MenuLeftContainer = ({ data, itemSelected }: { data: Array<MenuLeftType>, itemSelected: string }) => {
    const router = useRouter()
    
    // CORRECCIÓN: Extraemos 'currentRol' que es la variable global del rol activo
    const { changeCurrentRol, setUserData, userData, currentRol } = useContext(UserContext)
    
    const [isOpen, setIsOpen] = useState(false)
    const [isAsistenciasModalOpen, setIsAsistenciasModalOpen] = useState(false)

    // Obtenemos el usuario para el nombre
    const user = typeof userData === 'function' ? userData() : userData;

    // VALIDACIÓN: Usamos 'currentRol' en lugar de 'user.idrol'
    const rolActual = currentRol?.toString().toLowerCase() || '';
    const esAdminAsistencia = rolActual === 'aticmaster' || rolActual === 'rrhhmaster';

    // DEBUG para confirmar que ahora sí llega el rol
    useEffect(() => {
        console.log("✅ Rol detectado en el contexto:", currentRol);
    }, [currentRol]);

    const handleExit = async () => {
        await api.get('/api/auth/logout')
        changeCurrentRol('')
        setUserData('')
        localStorage.removeItem('idlogin')
        FilterInstance.resetLogout()
        router.push('/login')
    }

    return (
        <>
            <AsistenciasModal 
                isOpen={isAsistenciasModalOpen} 
                onClose={() => setIsAsistenciasModalOpen(false)} 
            />

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed left-0 top-[12vh] z-50 bg-blue-600 p-2 rounded-r-lg shadow-lg"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
            </button>

            {isOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />}

            <div className={`
                fixed lg:static top-[10vh] bottom-0 left-0 z-40
                h-[90vh] lg:h-full w-[8rem]
                c-rounded-large c-bg-primary
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                shadow-lg overflow-hidden
            `}>
                <div className="h-full overflow-y-auto py-2 flex flex-col justify-between">
                    <div className="grid grid-cols-1 gap-1">
                        {data.sort((a, b) => (a.order || 0) - (b.order || 0)).map((item) => {
                            item.isActive = item.key === itemSelected
                            return (
                                <div key={item.key} className="transform scale-90 lg:scale-100">
                                    {PropBox(item)}
                                </div>
                            )
                        })}

                        {/* EL BOTÓN AHORA DEBERÍA APARECER */}
                        {esAdminAsistencia && (
                            <div 
                                className="transform scale-90 lg:scale-100 mt-2 border-t border-white/20 pt-2 cursor-pointer"
                                onClick={() => setIsAsistenciasModalOpen(true)}
                            >
                                {PropBox({
                                    key: 'admin-asistencias-modal',
                                    label: 'Asistencias',
                                    icon: 'calendar', 
                                    path: '#',
                                    isActive: isAsistenciasModalOpen,
                                    order: 99
                                })}
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4 pb-4">
                        <div className="mb-4 w-full flex justify-center scale-75 lg:scale-90">
                            <FichajeBoton />
                        </div>

                        <Link onClick={handleExit} href="#" className="link-menu c-bg-primary mt-2 rounded-lg flex flex-col items-center px-1 transform scale-90 lg:scale-100" style={{ height: '4rem' }}>
                            <WebMCH24 color="white" />
                            <h3 className="text-white text-xs lg:text-sm">Salir</h3>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MenuLeftContainer
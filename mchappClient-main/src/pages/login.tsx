import React, { useState, useContext } from 'react'
import UserContext from '@/client/context/UserContext'
import { useRouter } from "next/router"
import Fade from 'react-reveal/Fade'
import UserService from '@/client/services/UserService'

const Login = () => {

    let userService = new UserService()

    const { setUserData, changeCurrentRol } = useContext(UserContext)
    const router = useRouter()

    const [isError, setIsError] = useState(false)
    const [credentials, setCredentials] = useState({ user: '', password: '' })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    // --- NUEVA FUNCIÓN PARA EL FICHAJE ---
    const registrarFichajeAutomatico = async (user: any) => {
        try {
            const ahora = new Date();
            const hoy = ahora.toISOString().split('T')[0]; // YYYY-MM-DD
            const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });

            // Llamada al endpoint de fichaje que ya tienes en el backend
            // Usamos fetch directamente para evitar dependencias circulares
            await fetch('/api/rrhh/fichajeoficina', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Token': user.token || '' 
                },
                body: JSON.stringify({
                    idusuario: user.id,
                    usuario: user.nombre_completo || user.username,
                    fecha: hoy,
                    entrada: `${hoy} ${hora}`,
                    estado: 1,
                    tipo_ejecucion: 'automático',
                    observacion: 'Fichaje automático al iniciar sesión',
                    jornada: user.jornada || 'Jornada Completa',
                    horario: user.horario || 'HC'
                })
            });
            console.log("⏱️ Intento de fichaje automático enviado");
        } catch (error) {
            console.error("❌ Error en fichaje automático:", error);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const Response = await userService.authUser(credentials, () => { setIsError(true) })
        
        if (!Response || !Response.data) return

        const _rolMain = Response.data.roles.find((el: any) => el.ismain === true)

        if (Response && _rolMain) {
            // 1. Guardamos datos en el contexto
            await setUserData(Response.data)
            await changeCurrentRol(_rolMain.id)
            
            // 2. Guardamos ID en localStorage (como ya hacías)
            localStorage.setItem('idlogin', Response.data.id.toString())

            // 3. --- EJECUTAR FICHAJE ANTES DE REDIRIGIR ---
            await registrarFichajeAutomatico(Response.data);

            // 4. Redirigir a la página principal del rol
            router.push('/' + _rolMain.id)
        }
    }

    return (
        <div className="min-h-screen w-full overflow-y-auto bg-no-repeat bg-cover c-bg-main-100">
            <div className="container mx-auto min-h-screen flex items-center justify-center py-6">
                <Fade top>
                    <div className="c-login-form c-rounded-large c-shadow-large">
                        <div className="card-body flex flex-col items-center text-primary">
                            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center" autoComplete="off">
                                <img
                                    src="/img/ico/LogoWhite.svg"
                                    className='c-logo-login'
                                    style={{width: 150}}
                                    alt="Logo"
                                />
                                <p className='text-white text-center px-4 mb-6'>
                                    Nos encargamos por ti y estamos encantados de hacerlo
                                </p>

                                <div className="w-full mb-4 px-4">
                                    <input
                                        type="text"
                                        name="user"
                                        className="form-control c-rounded-large c-form-input font-weight-bold p-4 w-full"
                                        id="user"
                                        placeholder="Usuario:"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="w-full mb-4 px-4">
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control c-rounded-large c-form-input font-weight-bold p-4 w-full"
                                        id="password"
                                        placeholder="Contraseña:"
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <button type="submit" className="border-0 mt-4 c-bg-0 transform hover:scale-110 transition-transform duration-200">
                                    <img src="/img/ico/HomeLogin.svg" alt="Entrar" style={{ width: 80, height: 80 }} />
                                </button>

                                {isError && (
                                    <p className="text-red-500 mt-4 text-center">Usuario o contraseña incorrectos</p>
                                )}
                            </form>
                        </div>
                    </div>
                </Fade>
            </div>
        </div>
    )
}

export default Login
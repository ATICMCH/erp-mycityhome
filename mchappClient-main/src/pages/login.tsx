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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // PRUEBA DE VIDA: Si ves esto, el código nuevo está funcionando
        console.log("🚀 Intento de login iniciado"); 

        const Response = await userService.authUser(credentials, () => { setIsError(true) })
        
        if (Response && Response.data) {
            const userData = Response.data;
            const _rolMain = userData.roles.find((el: any) => el.ismain === true)

            if (_rolMain) {
                // LÓGICA DE FICHAJE INTEGRADA
                try {
                    const ahora = new Date();
                    const hoy = ahora.toISOString().split('T')[0];
                    const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });

                    // Usamos la IP y puerto del API (3016)
                    await fetch('http://185.252.233.57:3016/api/rrhh/fichajeoficina', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Token': userData.token || '' 
                        },
                        body: JSON.stringify({
                            idusuario: userData.id,
                            usuario: userData.nombre_completo || userData.username,
                            fecha: hoy,
                            entrada: `${hoy} ${hora}`,
                            estado: 1,
                            tipo_ejecucion: 'automático',
                            observacion: 'Fichaje Login Web Automático',
                            jornada: userData.jornada || 'Jornada Completa',
                            horario: userData.horario || 'HC'
                        })
                    });
                    console.log("✅ Fichaje enviado");
                } catch (err) {
                    console.error("Error en fichaje:", err);
                }

                // GUARDAR SESIÓN Y REDIRIGIR
                await setUserData(userData)
                await changeCurrentRol(_rolMain.id)
                localStorage.setItem('idlogin', userData.id.toString())
                router.push('/' + _rolMain.id)
            }
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
                                        placeholder="Usuario:"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="w-full mb-4 px-4">
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control c-rounded-large c-form-input font-weight-bold p-4 w-full"
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
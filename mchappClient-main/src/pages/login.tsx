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

    const ejecutarFichaje = async (userData: any, loginUser: string) => {
        try {
            const ahora = new Date();
            const hoy = ahora.getFullYear() + '-' + 
                        String(ahora.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(ahora.getDate()).padStart(2, '0');
            const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });

            const nombreUsuario = userData.username || userData.nombre_completo || loginUser || 'Usuario ERP';
            const jornada = (userData.jornada && userData.jornada !== 'NA') ? userData.jornada : 'Jornada Completa';
            const horario = (userData.horario && userData.horario !== 'NA') ? userData.horario : 'HC';

            console.log("⏱️ Registrando entrada para:", nombreUsuario);

            // IMPORTANTE: Ponemos 'await' para que el navegador no cambie de página hasta terminar
            const res = await fetch('http://185.252.233.57:3016/api/rrhh/fichajeoficina', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Token': userData.token || '' 
                },
                body: JSON.stringify({
                    idusuario: userData.id,
                    usuario: nombreUsuario,
                    fecha: hoy,
                    entrada: `${hoy} ${hora}`,
                    estado: 1,
                    tipo_ejecucion: 'automático',
                    observacion: 'Fichaje automático Login Web',
                    jornada: jornada,
                    horario: horario
                })
            });
            
            const result = await res.json();
            console.log("📡 Respuesta servidor fichaje:", result);
            return true;
        } catch (err) {
            console.error("❌ Error en registro de entrada:", err);
            return false;
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const Response = await userService.authUser(credentials, () => { setIsError(true) })
        
        if (Response && Response.data) {
            const userData = Response.data as any; 
            const _rolMain = userData.roles?.find((el: any) => el.ismain === true)

            if (_rolMain) {
                // 1. ESPERAMOS a que el fichaje termine
                await ejecutarFichaje(userData, credentials.user);

                // 2. Guardamos sesión
                await setUserData(userData)
                await changeCurrentRol(_rolMain.id)
                localStorage.setItem('idlogin', userData.id.toString())
                
                // 3. Redirigimos (ahora sí, después de que el fichaje se envió)
                window.location.href = '/' + _rolMain.id;
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
                                <img src="/img/ico/LogoWhite.svg" className='c-logo-login' style={{width: 150}} alt="Logo" />
                                <div className="w-full mb-4 px-4 mt-6">
                                    <input type="text" name="user" className="form-control c-rounded-large c-form-input font-weight-bold p-4 w-full" placeholder="Usuario:" onChange={handleChange} required />
                                </div>
                                <div className="w-full mb-4 px-4">
                                    <input type="password" name="password" className="form-control c-rounded-large c-form-input font-weight-bold p-4 w-full" placeholder="Contraseña:" onChange={handleChange} required />
                                </div>
                                <button type="submit" className="border-0 mt-4 transform hover:scale-110 transition-transform duration-200">
                                    <img src="/img/ico/HomeLogin.svg" alt="Entrar" style={{ width: 80, height: 80 }} />
                                </button>
                                {isError && <p className="text-red-500 mt-4 text-center font-bold">Usuario o contraseña incorrectos</p>}
                            </form>
                        </div>
                    </div>
                </Fade>
            </div>
        </div>
    )
}

export default Login
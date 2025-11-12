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
    const Response = await userService.authUser(credentials, () => { setIsError(true) })
    if (!Response) return

        const _rolMain = Response.data?.roles.find(el => el.ismain === true)

        if (Response && _rolMain) {
            await setUserData(Response.data)
            await changeCurrentRol(_rolMain?.id)

            router.push('/' + _rolMain?.id)
            localStorage.setItem('idlogin', Response.data.id.toString())
            if (Response.token) {
                localStorage.setItem('token', Response.token)
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
                                    <span className="sr-only">Entrar</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                                        <circle cx="40" cy="40" r="38" stroke="#009FE3" strokeWidth="4" fill="#fff"/>
                                        <path d="M25 45L40 30L55 45" stroke="#009FE3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                        <rect x="32" y="45" width="16" height="10" stroke="#009FE3" strokeWidth="4" fill="#fff"/>
                                    </svg>
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

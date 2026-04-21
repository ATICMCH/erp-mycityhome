import UserContext from '@/client/context/UserContext'
import { Layout } from '@/components/Layout'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useRef } from 'react'
import { menu_rrhh_master } from '@/client/helpers/constants'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import ContentContainer from '@/components/ContentContainer'
import QRCode from 'qrcode'
import CryptoJS from 'crypto-js'

const QRFichar = () => {
    const _itemSelected = 'rrhh_master_fichaje'
    const { userData } = useContext(UserContext)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const router = useRouter()

    // Función para encriptar el token
    const encryptToken = (message: string): string => {
        const _keyEncript = "iot$@2024rbjX)"
        return CryptoJS.AES.encrypt(message, _keyEncript).toString()
    }

    useEffect(() => {
        // Generar QR para fichar
        // La URL debe apuntar al servidor mchapp-new-main en el puerto 3017
        const serverURL = typeof window !== 'undefined'
            ? window.location.origin.replace(':3018', ':3017')
            : 'http://185.252.233.57:3017'

        // Crear token con el mensaje requerido
        const tokenMessage = `iotmch2024atic$@_${Date.now()}`
        const encryptedToken = encryptToken(tokenMessage)
        const fichajeURL = `${serverURL}/fichar?qr=${encodeURIComponent(encryptedToken)}`

        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, fichajeURL, {
                width: 400,
                margin: 2,
                color: {
                    dark: '#0077BD',
                    light: '#FFFFFF'
                }
            }, (error) => {
                if (error) console.error('Error generating QR:', error)
            })
        }
    }, [])

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_rrhh_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <div className="w-full h-auto grid items-center justify-items-center">
                        <div className="w-[50rem] h-auto bg-[#ffffff72] rounded-3xl shadow-2xl p-8">
                            <h1 className="text-2xl text-[#0077bd] font-bold text-center mb-6">
                                QR para Fichaje de Oficina
                            </h1>

                            <div className="flex flex-col items-center space-y-4">
                                <div className="bg-white p-6 rounded-xl shadow-lg">
                                    <canvas ref={canvasRef}></canvas>
                                </div>

                                <div className="text-center">
                                    <p className="text-gray-700 mb-2">
                                        Escanea este código QR con tu dispositivo móvil
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Te redirigirá a la página de fichaje donde podrás ingresar tus credenciales
                                    </p>
                                </div>

                                <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        <strong>Instrucciones:</strong><br />
                                        1. Escanea el QR con tu móvil<br />
                                        2. Ingresa tu usuario y contraseña<br />
                                        3. El sistema registrará tu entrada/salida automáticamente
                                    </p>
                                </div>

                                <button
                                    onClick={() => window.print()}
                                    className="mt-4 px-6 py-2 bg-[#0077bd] text-white rounded-xl hover:bg-[#005a8d] transition"
                                >
                                    Imprimir QR
                                </button>
                            </div>
                        </div>
                    </div>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default QRFichar

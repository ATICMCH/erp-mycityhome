import React, { useEffect, useState, useCallback } from "react";
import { JSONObject, profile, rolenum } from "../types/globalTypes";
import UserContext from "./UserContext";
import UserService from '@/client/services/UserService'
import { NextRouter, useRouter } from "next/router";
import { PATH } from "../helpers/Path";
import { useLocalState } from "../helpers/Util";
import FetchApiServiceInstance from "../services/FetchApiService";
import { IData } from "../models/IData";

const UserState = (props: JSONObject) => {
    const { children } = props
    const userService = new UserService()
    const router = useRouter()

    const initialState: profile = {
        id: 0, nombre: '', apellido: '', email: '', estado: 0, roles: []
    }

    const [userData, setUserData] = useLocalState<profile>(initialState, 'user_data')
    const [solPendientesRMG, setSolPendientesRMG] = useState(0); 

    const updateSolPendientesRMG = useCallback(() => {
        let statusHttpUS = 200
        FetchApiServiceInstance.getSingleDataWithFilter(`/api/share/data/totaldata/`, { tipo: 'total_solicitides_pl_pendientes' }, (err) => {
            if (err.response) statusHttpUS = err.response.status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _data = data as IData
                setSolPendientesRMG(_data.total_data)
            }
        }).catch(err => console.log(err))
    }, []);

    const initialRolState = ''
    const localRolKey = 'current_rol'
    const [getCurrentRol, changeCurrentRol] = useLocalState<rolenum>(initialRolState, localRolKey)

    // --- LÓGICA DE SALIDA (LOGOUT) ---
    const logout = async () => {
        const idUser = localStorage.getItem('idlogin');
        if (idUser && idUser !== 'undefined') {
            try {
                // Apuntamos directamente a la API en el puerto 3016
                await fetch('http://185.252.233.57:3016/api/rrhh/fichajeoficina', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idusuario: idUser })
                });
            } catch (e) {
                console.error("Error al registrar salida");
            }
        }
        setUserData(initialState);
        localStorage.clear();
        window.location.href = '/login';
    }

    // --- LÓGICA DE ENTRADA DIFERIDA (AUTO-FICHAJE) ---
    useEffect(() => {
        const currentUser = userData();

        // Solo ejecutamos el temporizador si el usuario tiene un ID válido
        if (currentUser && currentUser.id > 0) {
            
            const realizarFichajeSilencioso = async () => {
                try {
                    const ahora = new Date();
                    const hoy = ahora.getFullYear() + '-' + 
                                String(ahora.getMonth() + 1).padStart(2, '0') + '-' + 
                                String(ahora.getDate()).padStart(2, '0');
                    const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });

                    const datosCompletos = currentUser as any;
                    const nombreUsuario = datosCompletos.nombre_completo || datosCompletos.nombre || datosCompletos.email || 'Usuario ERP';
                    const jornada = (datosCompletos.jornada && datosCompletos.jornada !== 'NA') ? datosCompletos.jornada : 'Jornada Completa';
                    const horario = (datosCompletos.horario && datosCompletos.horario !== 'NA') ? datosCompletos.horario : 'HC';

                    console.log("⏱️ Ejecutando auto-fichaje diferido para:", nombreUsuario);

                    // APUNTAMOS A LA API REAL (Puerto 3016)
                    const res = await fetch('http://185.252.233.57:3016/api/rrhh/fichajeoficina', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Token': datosCompletos.token || '' 
                        },
                        body: JSON.stringify({
                            idusuario: currentUser.id,
                            usuario: nombreUsuario,
                            fecha: hoy,
                            entrada: `${hoy} ${hora}`,
                            estado: 1,
                            tipo_ejecucion: 'automático',
                            observacion: 'Entrada automática por tiempo de conexión',
                            jornada: jornada,
                            horario: horario
                        })
                    });

                    // Forzamos la detección de errores HTTP
                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(`Código ${res.status}: ${errorData.error || 'Error desconocido en servidor'}`);
                    }

                    console.log("✅ Auto-fichaje completado con éxito y guardado en DB.");
                } catch (err: any) {
                    // Ahora sí nos dirá exactamente por qué falló
                    console.error("❌ Error en auto-fichaje:", err.message);
                }
            };

            // 15 segundos
            const timer = setTimeout(() => {
                realizarFichajeSilencioso();
            }, 15000);

            return () => clearTimeout(timer);
        }
    }, [userData]);


    const isRoleAllowed = (router: NextRouter, callback: () => void) => {
        const basePath = '/'+router.pathname.split('/')[1]
        if (!PATH[basePath]) return callback()
        const localValue = localStorage.getItem(localRolKey)
        const rolActual = getCurrentRol() != initialRolState ? getCurrentRol() : localValue && localValue != 'undefined' ? JSON.parse(localValue as string) : getCurrentRol();
        
        if (PATH[basePath].isAllowed(rolActual)) return callback()
        return router.push('/error/unauthorized')
    }

    const useAllowedEffect = (router: NextRouter, callback: () => void) => {
        useEffect(() => {
            (async () => {
                const response = await userService.getProfile(() => router.push('/login'))
                if(response) isRoleAllowed(router, callback)
            })()
        }, [])
    }

    return (
        <UserContext.Provider value={{
            solPendientesRMG, updateSolPendientesRMG, userData, setUserData,
            getCurrentRol, changeCurrentRol, isRoleAllowed, useAllowedEffect,
            isMobileMenuOpen: false, setIsMobileMenuOpen: () => {}, logout
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserState
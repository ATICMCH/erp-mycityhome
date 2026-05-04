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

    // --- LÓGICA DE SALIDA (LOGOUT) APUNTANDO A LA API (3016) ---
    const logout = async () => {
        const idUser = localStorage.getItem('idlogin');
        if (idUser && idUser !== 'undefined') {
            try {
                // Apuntamos al Backend (3016)
                await fetch('http://185.252.233.57:3016/api/rrhh/fichajeoficina', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idusuario: idUser })
                });
                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (e) {
                console.error("Error al registrar salida");
            }
        }
        setUserData(initialState);
        localStorage.clear();
        window.location.href = '/login';
    }

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
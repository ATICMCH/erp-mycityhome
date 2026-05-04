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

    const logout = async () => {
        const idUser = localStorage.getItem('idlogin');
        
        if (idUser && idUser !== 'undefined') {
            const url = 'http://185.252.233.57:3016/api/rrhh/fichajeoficina';
            const data = JSON.stringify({ idusuario: idUser });
            const blob = new Blob([data], { type: 'application/json' });
            
            // Beacon para salida
            navigator.sendBeacon(url, blob);
            console.log("👋 Salida enviada vía Beacon");
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
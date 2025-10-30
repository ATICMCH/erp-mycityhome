import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ISolicitudPrecio } from '@/client/models/ISolicitudPrecio'

const useLimitePrecioItem = (  item: ISolicitudPrecio ) => {
    const router = useRouter()
    const [ itemContent, setItemContent ] = useState<ISolicitudPrecio>(item)

    /**
     * Acualiza la información de las tarjetas, cuando se filtran
     */
    useEffect(() => {
        setItemContent( { ...item } )
    }, [item]) 

    const goEditData = (id: number) => {
        router.push(`/rmg/limiteprecio/${id}`)
    }

    const eventMap = (e: any) => {
        e.stopPropagation();
    }

    return {
        itemContent,
        goEditData,
        eventMap
    }
}

export default useLimitePrecioItem;
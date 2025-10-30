import { SHARE_PISOS_PATH } from '@/client/helpers/constants';
import { IPiso } from '@/client/models/IPiso';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import FetchApiServiceInstance from '@/client/services/FetchApiService';

/**
 * SIN USO [04/09/2023, se modificara el resul del API]
 * @returns 
 */
const useApartment = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<IPiso>>([])
    const [loading, setLoading] = useState(true)

    const headerTable = [
                            // { key:'ref_lead', label: 'Ref. Lead' },
                            { key:'etiqueta', label: 'Piso' },
                            { key:'nombre_comercial', label: 'N. Comercial' },
                            { key:'lestado', label: 'Estado' },
                            { key:'localidad', label: 'Localidad' },
                            // { key:'codigo_postal', label: 'C.P.' },
                            { key:'direccion_full', label: 'Dirección' },
                            { key:'actions', label: 'Acciones' }
                        ]

    useEffect(() => {
        FetchApiServiceInstance.getAllData(SHARE_PISOS_PATH).then( data => {
            if ( data ) {
                let _data = (data as Array<IPiso>)
                let _dList = [  ..._data.map(d => ( { ...d, 
                                                    // lestado: (d.estado === 1 ? 'Alta':'Baja'),
                                                    lestado: d.estado_general === undefined || d.estado_general === null ? '': ( (d.estado_general === 2)?'Activo':((d.estado_general === 3)?'Borrador':(d.estado_general === 4)?'Stop Sell':'') ),
                                                    // lugar: `${d.pais}, ${d.ciudad}`,
                                                    localidad: `${d.ciudad}, ${d.codigo_postal}`,
                                                    direccion_full: `${d.direccion}, Nro ${d.nro_edificio}, ${d.nro_piso}`,
                                                    actions: [
                                                        { key: 'info_comercial', label: 'Info. Comercial', link: `/rmg/apartments/${d.id}`},
                                                        { key: 'setting_reserva', label: 'Config. Reserva', link: `/rmg/apartments/${d.id}/configuracionreserva`},
                                                    ] 
                                                    } ))
                            ]
                setListData(_dList)
            }
        }).catch(err => {}).finally(()=>{
            setTimeout(() => setLoading(false), 500);
        })
    }, [])

    return {
        listData,
        headerTable,
        loading
    }
}

export default useApartment;
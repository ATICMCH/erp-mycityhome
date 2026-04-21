import FetchApiServiceInstance from '@/client/services/FetchApiService'
import React from 'react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { IArticulo } from '@/client/models/IArticulo'
import { IArticuloPiso } from '@/client/models/IArticuloPiso'

const InventarioBuscar = ({setNameItem}:{setNameItem:any}) => {
    
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)

    const [listArt, setListArt] = useState<Array<IArticuloPiso>>([])

    const busca = (e: any) => {
        
        let statusHttpUS = 200

        let value = e.target.value
        
        console.log(value)

        let JSONObject = {

            search_all: value

        }
            
        FetchApiServiceInstance.getAllWithFilter('/api/da/inventario/p/inventario',JSONObject,(err) => {

            const { status } = err.response!

            statusHttpUS = status

        }).then( data => {

                if ( statusHttpUS === 200 && data && (data as Array<any>).length !== 0 ) {

                    let _data = data as Array<IArticuloPiso>
           
                    //console.log(_data)
                    //console.log(_data[0].tag)

                    if (_data.length !== 0){

                        setListArt(_data)
                        console.log(_data)

                    }else{

                        _data = []

                        setListArt(_data)

                    }
                    
                    //const articulos = data.map(articulo => <li><b>{data.tag.value}</b></li>)

                }

        }).catch(err => {

                console.log('err: ', err)

        }).finally(()=>{

                // setTimeout(() => setLoading(false), 200)

        })
    }

    const AddItem = (e: any) => {

        setNameItem(e)

    }

    return(

        <div className='ml-5'>

            {/* <form className='mt-10 w-[50%]'>   

            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only ">Search</label>

            <div className="relative">

                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">

                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">

                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>

                    </svg>

                </div>

                <div className='flex'>

                <input type="search" onChange={busca} id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." required></input>

                </div>
               
            </div>

         </form>

         <div className='absolute1 mt-1 w-full p-2 shadow-sm rounded-bl rounded-br mt-0 overflow-y-hiden'>

         <ul>

            {
                
                    listArt.map(el => (

                        <li onClick={() => AddItem(el)}>

                            {`${el.mobiliario} ${el.id_dispositivo_ref} ${el.etiqueta} (${el.cantidad})`}

                        </li>))
                  
            }

         </ul>

         </div> */}
           
        </div>

    )
    
}

export default InventarioBuscar
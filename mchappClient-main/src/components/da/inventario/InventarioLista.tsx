import { IArticulo } from "@/client/models/IArticulo"
import { IArticuloPiso } from "@/client/models/IArticuloPiso"
import FetchApiServiceInstance from "@/client/services/FetchApiService"
import { useRouter } from "next/router"
import React from "react"
import { useEffect, useState } from 'react'

const InventarioLista = ({nameItem}:{nameItem:any}) => {
    
    const router = useRouter()

    var cantidadE = ""

    let itemId = nameItem.id

    const [listArt, setListArt] = useState<Array<IArticuloPiso>>([])
    
    //const [id_piso, l_articulos, id_piso_mover]
    //const [cantidadI, id_articulo] = useState<Array<any>>([])


    let statusHttpUS = 200

    let id = BigInt((router.query.id as string) || 0)

    //let value = id

    let JSONObject = {

       //search_all: value

    }

    let JSONObjectA = {

        id_piso: 100,
        l_articulos: [{id_articulo: nameItem.id, resta: cantidadE}],
        id_piso_mover: id
 
    }


    const save = () => {



    }

    const mover = () =>{

        

        

    }

    const subirItem = (e: string, a:string)=>{

        //alert(e)

        let JSONObjectA = {

            id_piso: 100,
            l_articulos: [{resta: 1, id_articulo: 1}],
            id_piso_mover: id
     
        }

        FetchApiServiceInstance.update(`/api/da/inventario/${id!}`,JSONObjectA,(err) => {

            const { status } = err.response!
    
            statusHttpUS = status
    
        }).then( data => {
    
            if ( statusHttpUS === 200 && data && (data as Array<any>).length !== 0 ) {
    
                let _data = data as Array<IArticuloPiso>
               
                //console.log(_data)
                //console.log(_data[0].tag)
    
                if (_data.length !== 0){
    
                    setListArt(_data)
    
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

    const subido = (j: string)=>{

        



    }

    const deletaAll = () =>{

        //let newLista = listArt.filter(listArt => listArt.id = listArt.id)
        //newLista = listArt.filter(listArt => listArt.total)
        //let newLista = listArt.map(li => ({id: li.id, resta: li.total}))
        //console.log(newLista)

    }

    const EliminarDato = () =>{

        let JSONObjectE = nameItem.id

        FetchApiServiceInstance.getAllWithFilter('/api/da/articulos/p/articulos',JSONObject,(err) => {

            const { status } = err.response!
    
            statusHttpUS = status
    
        }).then( data => {
    
            if ( statusHttpUS === 200 && data && (data as Array<any>).length !== 0 ) {
    
                let _data = data as Array<IArticuloPiso>
               
                //console.log(_data)
                //console.log(_data[0].tag)
    
                if (_data.length !== 0){
    
                    setListArt(_data)
    
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
    
    useEffect(() => {

        FetchApiServiceInstance.getAllWithFilter(`/api/da/inventario/piso/${id}`,JSONObject,(err) => {

            const { status } = err.response!
    
            statusHttpUS = status
    
        }).then( data => {
    
            if ( statusHttpUS === 200 && data && (data as Array<any>).length !== 0 ) {
    
                let _data = data as Array<IArticuloPiso>
               
                //console.log(_data)
                //console.log(_data[0].tag)
    
                if (_data.length !== 0){
    
                    setListArt(_data)
                    
    
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

    })

    return(

        <div className="mt-10 ml-5">

           {/* <div className="w-full flex">
                
                <div className="flex">

                    <label className=" w-[174.67px] h-[24px] ">Nombre</label>

                </div>

                <div  className="flex ml-[20px]">

                    <label className=" w-[174.67px] h-[24px] ">Cantidad</label> 

                </div>

                <div  className="flex ml-[20px]">

                    <label className=" w-[80%] w-[174.67px] h-[24px]">Stock</label>

                </div>
             
            </div>

            <div className="w-full flex">

                <div className="flex bg-white">

                    <label className=" w-[174.67px] h-[24px] ">{nameItem.tag}</label>

                </div>

                <div  className="flex ml-[20px] bg.white">

                    <input type="number" min="0"/>  

                </div>

                <div  className="flex ml-[20px] bg.white">

                    <label className="bg-white w-[174.67px] h-[24px]">{nameItem.stock}</label>

                </div>

                <div className="bg-blue ml-[20px] rounded">

                    <button onClick={e => subirItem(cantidadE, nameItem.id)}  className="mx-[5px]">add</button> 

                </div>

                <div className="relative">

                </div>

            </div>

            <div>
                   <div className='absolute1 mt-1 w-full p-2 shadow-lg rounded-bl rounded-br mt-0 overflow-y-hiden'> 

                <ul>
            
                    {
                        listArt.map(el => (<li>

                            <div className="flex mr-0 my-[15px]"> <div className="w-[500px]">{`Nombre: ${el.mobiliario} Cantidad: ${el.cantidad}`}</div> <div className="bg-blue ml-[20px] flex rounded">  <button className="mx-[2.5px] my-[2.5px] rounded-md">delete</button>  </div> <div className="bg-blue ml-[20px] rounded">  <button className=" rounded-md mx-[2.5px] my-[2.5px]">mover</button>  </div> </div>

                        </li>))
                    
                    }

                </ul>

            </div>

        </div>

            <div className="flex">

                <div className="bg-blue ml-[20px] rounded">

                    <button className="mx-[5px]">Save</button>

                </div>

                <div className="bg-blue ml-[20px] rounded">

                    <button onClick={deletaAll} className="mx-[5px]">Delete</button>

                </div>

            </div> */}
            
        </div>

    )

}

export default InventarioLista
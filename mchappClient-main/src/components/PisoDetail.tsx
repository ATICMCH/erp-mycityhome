import { MSG_TABLE_EMPTY, MSG_TABLE_LOADING } from "@/client/helpers/constants"
import { IPiso } from "@/client/models/IPiso"
import HomeContainer from "./HomeContainer"


const PisoDetail = ({ data }: { data: IPiso }) => {

    const completeAddress = `${data?.ciudad || ""}, ${data?.direccion || ""}, 
    ${data?.nro_edificio || ""} piso: ${data?.nro_piso || ""}`

    const etiqueta = data?.etiqueta || ""

    //Imagen quemada para la demostracion
    return (
        <div className="w-full h-[60vh] grid items-center justify-items-center1">
            <div className="lg:w-[80rem] w-[90vw] h-[30rem] bg-[#ffffff4b] rounded-3xl shadow-2xl grid grid-rows-6">
                <div className=" row-span-3 grid items-center justify-items-center">
                    <div className=" flex flex-col items-center space-y-5">
                        <h1 className="text-lg text-[#0077bd] mt-5"> <b>{etiqueta} { }</b></h1>
                        <div className="flex">
                            <img className="rounded-lg" width="500em" height="500em" src="https://images.pexels.com/photos/7534554/pexels-photo-7534554.jpeg" />
                        </div>
                    </div>
                    <h1 className="text-lg text-[#0077bd] m-5"> <b>{completeAddress} { }</b></h1>
                </div>
                
            </div>
        </div>

    )
}
export default PisoDetail


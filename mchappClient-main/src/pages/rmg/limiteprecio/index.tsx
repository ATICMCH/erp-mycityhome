import { Layout } from "@/components/Layout";
import React from "react";
import MenuLeftContainer from "@/components/MenuLeftContainer";
import {menu_rmg} from "@/client/helpers/constants";
import ContentContainer from "@/components/ContentContainer";
import LimitePrecioContainer from "@/components/rmg/limiteprecio/LimitePrecioContainer";

const VacacionesShare = () =>{
    const _itemSelected = 'na'
    //const _path = '/rmg/solicitudes'
    //const _typeTotalData = 'all_vacaciones'
    //const _pathGetDataApi = '/api/share/vacaciones/'

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_rmg} itemSelected={_itemSelected} />
                <ContentContainer>
                    <LimitePrecioContainer />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default VacacionesShare
import { Layout } from "@/components/Layout"
import React from 'react'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_rmg_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import PComercialContainer from "@/components/rmg/PComercialContainer"

const Apartments = () => {
    const _itemSelected = 'rmg_apartments'

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_rmg_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <PComercialContainer />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Apartments
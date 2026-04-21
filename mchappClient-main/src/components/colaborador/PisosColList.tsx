import React, { useState } from 'react'
// import PisosDAItem from './PisosShareItem'
import { IPiso } from '@/client/models/IPiso'
import PisosColItem from './PisosColItem'

const PisosColList = ({ items }: { items: Array<IPiso> }) => {
    return (
        <div className="bg-white table-content">
            { 
                items.sort((a, b) => a.etiqueta.localeCompare(b.etiqueta)).map((item, index) => { //Ordenado alfabeticamente
                    return <PisosColItem key={'item-piso' + index} item={item} />
                })
            }
        </div>
    )
}

export default PisosColList
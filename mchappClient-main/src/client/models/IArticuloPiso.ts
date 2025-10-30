import { IModel } from "../helpers/IModel"

export interface IArticuloPiso extends IModel {
    id_piso: number
    id_articulo: number
    cantidad: number
    mobiliario: string
    stock: number
    total: number
    id_dispositivo_ref: string
    etiqueta: string
    tag: string

}
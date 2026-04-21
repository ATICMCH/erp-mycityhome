import { IModel } from "../helpers/IModel"
import { IVariablesReserva } from "./IVariablesReserva"

export interface IInfoPisoComercial extends IModel {
    etiqueta?: any    // 👈 AGREGAR ?
    ciudad?: any      // 👈 AGREGAR ?
    id?: number
    nombre_comercial: string
    link_nombre_comercial?: string
    estado_general: number
    link_tour_virtual?: string
    link_calendario_disponibilidad?: string
    link_repositorio: string
    tiene_anuncio: boolean
    anuncio_usuario?: string
    anuncio_contrasenia?: string
    anuncio_plataforma?: string
    anuncio_link?: string

    // fields [layout]
    lestado?: string
    
    // Relaciones
    idpiso: number

    // apartment data
    a_etiqueta?: string
    a_codigo?: string
    a_localidad?: string
    a_codigo_postal?: string
    a_full_direccion?: string

    // detalle piso DA
    cp_ocupacion_maxima?: number        //Actualizado
    cp_m2?: number                      //Actualizado
    ds_nro_dormitorios?: number         //Actualizado
    ds_nro_camas?: number               //Actualizado
    bs_nro_banios?: number              //Actualizado
    bs_nro_aseos?: number               //Actualizado
    ds_nro_sofacama?: number            //Actualizado
    lbl_aire_acondicionado?: string
    lbl_calefaccion?: string
    lbl_ascensor?: string
    lbl_discapacidad?: string
    ds_descripcion_camas?: string       //Actualizado
    bs_descripcion_banios?: string      //Actualizado
    ds_descripcion_sofacama?: string    //Actualizado
    ubicacion_mapa?: string
    if_zonas?: string                   //Actualizado

    // form plataforma [complementos]
    l_idplataforma?: number
    l_link?: string
    plataformas: Array<{ id: number, codigo: string, nombre: string, link: string, link_tooltip?: string }>

    // form variables reserva [complementos]

    vr_variablereserva?: IVariablesReserva
    // variablesreserva: Array<{ id: number }>
    variablesreserva: Array<IVariablesReserva>

    // Fields layout
    precio_alquiler_tooltip?: number
    precio_muebles_tooltip?: number
    total_tootip?: number
    precio_limite_tooltip?: number

    // SI, NO, NA
    estado_alquiler_rentable?: string
}
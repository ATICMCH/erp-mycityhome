import { IModel } from "../helpers/IModel";

export interface IDeviceReport extends IModel {
      id?: number
      fecha?: string
      tipo: string
}
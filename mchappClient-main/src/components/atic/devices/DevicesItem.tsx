import React from "react";
import { useRouter } from "next/router";
import { BsPencilFill } from "react-icons/bs";
import { IDevice } from "@/client/models/IDevice";
import useDeviceItem from "@/client/hooks/atic/devices/useDeviceItem";
import {
  AiOutlineBulb,
  AiOutlineLock,
  AiOutlineMobile,
  AiOutlinePhone,
  AiOutlineVideoCamera,
} from "react-icons/ai";

const DevicesItem = ({ item }: { item: IDevice }) => {
  const router = useRouter();

  const { itemContent, goEditData, eventMap } = useDeviceItem(item);

  /**
   * Retorna color row
   * @param estado
   * @param etiqueta
   * @returns
   */
  const getColorRow = (
    estado: number,
    etiqueta: string,
    estado_piso: number
  ): string => {
    if (etiqueta.toLocaleLowerCase() === "libre")
      return "text-[green] text-bold";
    else if (estado_piso === 0 || estado_piso === -1)
      return "text-[red] text-bold";
    return "text-[#0077BD]";
  };

  const getBackgroudRow = (estado: number): string => {
    if (estado === 0) return "bg-[#fde3b2]";
    else if (estado === -1) return "bg-[#fbd0d0]";
    return "";
  };

  return (
    <div className={`w-full h-auto`}>
      <div
        className={`data-table-row-nopointer ${getBackgroudRow(
          itemContent.estado === undefined ? -2 : itemContent.estado
        )} grid grid-cols-8 p-1 pl-2 text-[#0077BD]`}
      >
        <div className="grid col-span-2">
          <span className="flex">
            {itemContent.tdevice === "lock" ? (
              <div className="flex">
                <AiOutlineLock title="Lock" color="green" size={"1.4rem"} />
              </div>
            ) : (
              ""
            )}
            {itemContent.tdevice === "ttlock" ? (
              <div className="flex">
                <AiOutlineLock title="TTLock" color="green" size={"1.4rem"} />
              </div>
            ) : (
              ""
            )}
            {itemContent.tdevice === "sonoff" ? (
              <div className="flex">
                <AiOutlineBulb title="SonOff" color="#ebb601" size={"1.4rem"} />
              </div>
            ) : (
              ""
            )}
            {itemContent.tdevice === "movil" ? (
              <div className="flex">
                <AiOutlineMobile
                  title="Movil"
                  color="#0077BD"
                  size={"1.4rem"}
                />
              </div>
            ) : (
              ""
            )}
            {itemContent.tdevice === "telefonillo" ? (
              <div className="flex">
                <AiOutlinePhone
                  title="Telefonillo"
                  color="#ff5e00"
                  size={"1.4rem"}
                />
              </div>
            ) : (
              ""
            )}
            {itemContent.tdevice === "camara" ? (
              <div className="flex">
                <AiOutlineVideoCamera
                  title="Camara"
                  color="#fff"
                  size={"1.4rem"}
                />
              </div>
            ) : (
              ""
            )}
            &nbsp;&nbsp;{itemContent.codigo}
          </span>
        </div>

        <div>
          <span className="flex">{itemContent.nombre}</span>
        </div>

        <div className="grid col-span-2">
          <span
            className={`flex ${getColorRow(
              itemContent.estado || -2,
              itemContent.etiqueta || "",
              itemContent.estado_piso === undefined
                ? -2
                : itemContent.estado_piso
            )}`}
          >
            {itemContent.etiqueta}
          </span>
        </div>

        <div className="grid col-span-2">
          <span className="flex">{itemContent.descripcion}</span>
        </div>

        <div className="flex justify-end">
          <div
            onClick={() => goEditData(itemContent.id!)}
            className="icon-table-row grid justify-center rounded-full w-[1.8rem] h-[1.6rem] card-action"
          >
            <BsPencilFill className="mt-1" title="Editar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevicesItem;

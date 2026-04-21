import React from "react";
import {
  TbBrandAirbnb,
  TbBrandBooking,
  TbBrandBitbucket,
  TbBrandApple,
} from "react-icons/tb";
import {
  BiAccessibility,
  BiBath,
  BiBed,
  BiDetail,
  BiDevices,
  BiMale,
} from "react-icons/bi";
import { useRouter } from "next/router";
import { MdHomeFilled } from "react-icons/md";
import Tooltip from "../Tooltip";
import {
  AiFillBulb,
  AiFillEnvironment,
  AiFillLock,
  AiFillSave,
  AiFillSetting,
  AiFillVideoCamera,
  AiOutlineBulb,
  AiOutlineClose,
  AiOutlineEnvironment,
  AiOutlineLink,
  AiOutlineLock,
  AiOutlineMobile,
  AiOutlinePhone,
  AiOutlineVideoCamera,
  AiTwotoneEdit,
} from "react-icons/ai";
import ValidationsInstance from "@/client/helpers/Validations";
import { BsDoorClosed, BsPencilSquare } from "react-icons/bs";
import ElevadorIcon from "../Iconos/ElevadorIcon";
import CalefaccionIcon from "../Iconos/CalefaccionIcon";
import AreaMMIcon from "../Iconos/AreaMMIcon";
import AireAconIcon from "../Iconos/AireAconIcon";
import usePisoDAItem from "@/client/hooks/da/pisos/usePisoDAItem";
import { IPiso } from "@/client/models/IPiso";
import Link from "next/link";
import SofaCamaIcon from "../Iconos/SofaCamaIcon";
import { FaTools } from "react-icons/fa";

const PisosDAItem = ({
  position,
  item,
  statusTooltip,
  idTooltipSelected,
  setStatusTooltip,
  setIdTooltipSelected,
}: {
  position: string;
  item: IPiso;
  statusTooltip: boolean;
  idTooltipSelected: string;
  setStatusTooltip: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  setIdTooltipSelected: (value: string | ((prevVar: string) => string)) => void;
}) => {
  const router = useRouter();

  const {
    saveLinkPlataforma,
    saveEstadoGeneral,
    savePrecioAlquiler,
    savePrecioMueble,
    savePrecioLimite,
    handleChangePlataforma,
    changeStatusTootip,
    closeTooltip,
    handleChange,
    itemContent,
    goEditData,
    eventStop,
  } = usePisoDAItem(item, setStatusTooltip, setIdTooltipSelected);

  return (
    <div
      className={`w-full rounded-2xl ${
        itemContent.estado === 0
          ? "bg-red-50 border-2 border-[red]"
          : "bg-[#ffffffc8]"
      } p-3 sm:p-5`}
    >
      <div className="flex flex-col lg:flex-row w-full gap-3 sm:gap-4">
        <div className="w-full lg:w-1/3 min-w-0">
          <h3
            className={`font-bold ${
              itemContent.estado === 0 ? "text-[red]" : "text-blue-700"
            }`}
          >
            <span className="flex">
              {itemContent.etiqueta}&nbsp;
              {ValidationsInstance.checkUrl(
                itemContent.ubicacion_mapa || ""
              ) ? (
                <Link
                  href={`${itemContent.ubicacion_mapa}`}
                  target="_blank"
                  onClick={eventStop}
                  className="px-3m py-3m h-auto w-auto contents"
                >
                  <AiFillEnvironment
                    title="Ubicación mapa"
                    color="#f15353"
                    size={"1.5rem"}
                  />
                </Link>
              ) : (
                <AiFillEnvironment
                  title="Ubicación mapa"
                  color="#a8a8a8"
                  size={"1.5rem"}
                />
              )}
            </span>
          </h3>
          <div className="text-base">{itemContent.full_direccion}</div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
            {itemContent.dispositivos_str?.includes("lock") &&
              !itemContent.dispositivos_str?.includes("ttlock") && (
                <div className="flex">
                  <AiOutlineLock title="Lock" color="green" size={"1.7rem"} />
                </div>
              )}
            {itemContent.dispositivos_str === "ttlock" && (
              <div className="flex">
                <AiOutlineLock title="TTLock" color="brown" size={"1.7rem"} />
              </div>
            )}
            {itemContent.dispositivos_str?.includes("sonoff") ? (
              <div className="flex">
                <AiOutlineBulb title="SonOff" color="#ebb601" size={"1.7rem"} />
              </div>
            ) : (
              ""
            )}
            {itemContent.dispositivos_str?.includes("movil") ? (
              <div className="flex">
                <AiOutlineMobile
                  title="Móvil"
                  color="#0077BD"
                  size={"1.7rem"}
                />
              </div>
            ) : (
              ""
            )}
            {itemContent.dispositivos_str?.includes("telefonillo") ? (
              <div className="flex">
                <AiOutlinePhone
                  title="Telefonillo"
                  color="#ff5e00"
                  size={"1.7rem"}
                />
              </div>
            ) : (
              ""
            )}
            {itemContent.dispositivos_str?.includes("camara") ? (
              <div className="flex">
                <AiOutlineVideoCamera title="Camara" size={"1.7rem"} />
              </div>
            ) : (
              ""
            )}
            {/* <div className='flex'>
                            <AiOutlineVideoCamera title='Camara' size={'1.5rem'} />
                        </div> */}
          </div>
        </div>

        <div className="w-full lg:w-2/3 min-w-0">
          <div className="flex items-start gap-4">
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 items-center">
              <div className="flex font-bold text-sm sm:text-base md:text-[17px]">
                <span className="text-[#0077BD]">
                  {itemContent.cp_ocupacion_maxima}
                </span>
                <BiMale title="Capacidad" className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <div className="flex font-bold text-sm sm:text-base md:text-[17px]">
                <span className="text-[#0077BD]">
                  {itemContent.ds_nro_dormitorios}
                </span>
                &nbsp;
                <BsDoorClosed title="Habitaciones" className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <div className="flex font-bold text-sm sm:text-base md:text-[17px]">
                <span className="text-[#0077BD]">
                  {itemContent.ds_nro_camas}
                </span>
                &nbsp;
                <BiBed
                  title={`Camas ${
                    itemContent.ds_descripcion_camas
                      ? `, ${itemContent.ds_descripcion_camas}`
                      : ""
                  }`}
                  className="w-5 h-5 sm:w-7 sm:h-7"
                />
              </div>
              <div className="flex font-bold text-sm sm:text-base md:text-[17px]">
                <span className="text-[#0077BD]">
                  {itemContent.bs_nro_banios}
                </span>
                &nbsp;
                <BiBath
                  title={`Baños ${
                    itemContent.bs_descripcion_banios
                      ? `, ${itemContent.bs_descripcion_banios}`
                      : ""
                  }`}
                  className="w-5 h-5 sm:w-7 sm:h-7"
                />
              </div>
              <div className="flex font-bold text-sm sm:text-base md:text-[17px]">
                <span className="text-[#0077BD]">
                  {itemContent.ds_nro_sofacama}
                </span>
                &nbsp;
                <SofaCamaIcon
                  title={`Sofacama ${
                    itemContent.ds_descripcion_sofacama
                      ? `, ${itemContent.ds_descripcion_sofacama}`
                      : ""
                  }`}
                  color={"black"}
                  className="w-5 h-5 sm:w-7 sm:h-7"
                />
              </div>
              <div className="flex font-bold text-sm sm:text-base md:text-[17px]">
                <span className="text-[#0077BD]">
                  {itemContent.lbl_ascensor}
                </span>
                &nbsp;
                <ElevadorIcon
                  title="Ascensor"
                  color={"black"}
                  className="w-5 h-5 sm:w-7 sm:h-7"
                />
              </div>
              <div className="flex font-bold text-sm sm:text-base md:text-[17px]">
                <span className="text-[#0077BD]">
                  {itemContent.lbl_calefaccion}
                </span>
                &nbsp;
                <CalefaccionIcon
                  title="Calefacción"
                  color={"black"}
                  className="w-5 h-5 sm:w-7 sm:h-7"
                />
              </div>
              <div className="flex font-bold text-sm sm:text-base md:text-[17px]">
                <span className="text-[#0077BD]">
                  {itemContent.lbl_aire_acondicionado}
                </span>
                &nbsp;
                <AireAconIcon
                  title="Aire acondicionado"
                  color={"black"}
                  className="w-5 h-5 sm:w-7 sm:h-7"
                />
              </div>
              <div className="flex font-bold text-sm sm:text-base md:text-[17px]">
                <span className="text-[#0077BD]">{itemContent.cp_m2}</span>
                &nbsp;
                <AreaMMIcon
                  title="Área"
                  color={"black"}
                  className="w-5 h-5 sm:w-7 sm:h-7"
                />
              </div>
              <div className="flex font-bold text-sm sm:text-base md:text-[17px]">
                <span className="text-[#0077BD]">
                  {itemContent.lbl_discapacidad}
                </span>
                &nbsp;
                <BiAccessibility
                  title="Accesibildad discapacidad"
                  className="w-5 h-5 sm:w-7 sm:h-7"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors">
                <BsPencilSquare
                  onClick={() => goEditData(itemContent.id!)}
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  title="Editar"
                />
              </button>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors">
                {ValidationsInstance.checkUrl(
                  itemContent.link_source_mantenimiento || ""
                ) ? (
                  <Link
                    href={`${itemContent.link_source_mantenimiento}`}
                    target="_blank"
                    onClick={eventStop}
                    className="inline-flex items-center justify-center w-full h-full"
                  >
                    <FaTools
                      title="Mantenimiento"
                      color="black"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </Link>
                ) : (
                  <FaTools
                    title="Mantenimiento"
                    color="#a8a8a8"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                )}
              </div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors">
                <Link
                  href={`/da/apartments/${itemContent.id}/devices/asociar`}
                  className="inline-flex items-center justify-center w-full h-full"
                >
                  <BiDevices 
                    title="Dispositivos" 
                    color="black" 
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PisosDAItem;

import { Layout } from "@/components/Layout";
import { useEffect, useMemo } from "react";
import React from "react";
import {
  ALERT_DANGER,
  CITIES,
  STATES,
  TIPO_LEADS,
} from "@/client/helpers/constants";
import AlertContainer from "@/components/AlertContainer";
import OptionsOnSelect from "@/components/OptionsOnSelect";
import {
  AiOutlinePlus,
  AiFillSave,
  AiOutlineClose,
  AiOutlineWhatsApp,
  AiOutlineMail,
  AiOutlineComment,
  AiOutlineBarcode,
} from "react-icons/ai";
import {
  BsFillHouseFill,
  BsFillPersonCheckFill,
  BsFillPersonFill,
  BsFillPhoneFill,
  BsFillTelephoneFill,
  BsLink,
  BsListCheck,
} from "react-icons/bs";
import EnumButtonsIcons from "@/components/EnumButtonsIcons";
import DeviceLockForm from "./DeviceLockForm";
import DeviceTelefonillo from "./DeviceTelefonillo";
import DeviceMovil from "./DeviceMovil";
import { IDevice } from "@/client/models/IDevice";
import useDeviceForm from "@/client/hooks/atic/devices/useDeviceForm";
import DeviceTTLockForm from "./DeviceTTLockForm";

const DeviceForm = ({
  pathToBack,
  dataDB,
  handleChange,
  flagTypeDevices,
  setFlagTypeDevices,
  dataTypeDeviceSel,
  msgError,
  errorValidate,
}: {
  pathToBack: string;
  dataDB: IDevice;
  flagTypeDevices: number | null;
  setFlagTypeDevices: (e: any) => void;
  dataTypeDeviceSel: { id: number; code: string };
  msgError: string;
  errorValidate: boolean;
  handleChange: (e: any) => void;
}) => {
  const _pathGoToBack = "/atic/leads";

  const { listTypeDevices, pisos } = useDeviceForm(dataDB);

  /**
   *  Este codigo ↓ lo que hace es cambiar el valor inicial del flagtypes
   */

  // useEffect(()=>{
  //     handleChange({target:{value:flagTypeDevices, name:"idtipodispositivo"}})
  // },[flagTypeDevices])

  const drawListOnSelect = (
    lData: Array<{ key: string; name: string }>,
    codeKey: string,
    label?: string
  ) => {
    return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />;
  };

  const DrawFromDevices = () => {
    if (dataTypeDeviceSel.code === "lock")
      return <DeviceLockForm data={dataDB} handleChange={handleChange} />;

    if (dataTypeDeviceSel.code === "ttlock")
      return <DeviceTTLockForm data={dataDB} handleChange={handleChange} />;

    if (dataTypeDeviceSel.code === "telefonillo")
      return <DeviceTelefonillo data={dataDB} handleChange={handleChange} />;

    if (dataTypeDeviceSel.code === "movil")
      return <DeviceMovil data={dataDB} handleChange={handleChange} />;

    return <b>No hay información adicional!!</b>;

    // switch(dataTypeDeviceSel.code) {
    //     case 'Lock':
    //             return <DeviceLockForm data={dataDB} handleChange={handleChange} />

    //         break;
    //     case 'Manija':
    //         return <DeviceLockForm data={dataDB} handleChange={handleChange} />

    //         break;

    // }
    // return <b>No hay información adicional!!</b>
  };

  return (
    <div className="w-auto min-h-[10rem] grid grid-flow-col">
      <div className="w-[80rem] w-min-[80rem] min-h-[10rem] pl-[6rem]">
        <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
          {errorValidate ? (
            <AlertContainer typeAlert={ALERT_DANGER}>
              <div dangerouslySetInnerHTML={{ __html: msgError }} />
            </AlertContainer>
          ) : (
            <></>
          )}
          <input type="hidden" name="id" value={dataDB.id?.toString()} />
          <div className="min-h-[35rem] grid grid-cols-2m space-x-5">
            <div className="h-full grid space-y-5">
              <div className=" min-h-[14rem] bg-[#5da7d5c0] rounded-2xl p-5 space-y-4">
                <h1 className="text-lg text-[#0077bd] font-bold">
                  Dispositivo
                </h1>

                <div className="grid space-x-2">
                  <div className="flex text-sm">
                    <EnumButtonsIcons
                      txtSize="sm"
                      values={listTypeDevices}
                      selected={flagTypeDevices}
                      setSelected={setFlagTypeDevices}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 space-x-2">
                  <div className=" w-full flex text-sm">
                    <label className="px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full">
                      <AiOutlineBarcode
                        title="codigo dispositivo"
                        size={"1.2rem"}
                      />
                    </label>
                    <input
                      placeholder="Código dispositivo"
                      value={dataDB.codigo}
                      onChange={handleChange}
                      type="text"
                      name="codigo"
                      className="rounded-r-full p-2 w-[85%] outline-blue-800"
                    />
                  </div>
                  <div className=" w-full flex text-sm">
                    <label className="px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full">
                      <BsLink title="Nombre" size={"1.2rem"} />
                    </label>
                    <input
                      placeholder="Nombre dispositivo"
                      value={dataDB.nombre}
                      onChange={handleChange}
                      type="text"
                      name="nombre"
                      className="rounded-r-full p-2 w-[85%] outline-blue-800"
                    />
                  </div>
                  <div className=" w-full flex text-sm">
                    <label className="px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full">
                      <span className="display-icon-error1">
                        <BsFillHouseFill title="Piso" size={"1.2rem"} />
                      </span>
                    </label>
                    <select
                      value={dataDB.idpiso?.toString() || 0}
                      onChange={handleChange}
                      name="idpiso"
                      className="rounded-r-full p-2 w-[85%] col-span-6"
                    >
                      {useMemo(
                        () => drawListOnSelect(pisos, "sp", "Seleccionar piso"),
                        [pisos]
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4">
                    <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">
                      Características adicionales
                    </legend>

                    {DrawFromDevices()}
                  </fieldset>
                </div>

                <div className="w-full flex text-sm">
                  <label className="px-4 py-2 h-auto w-[3.0rem] bg-[#0077bd] text-white rounded-l-full col-span-2">
                    <span className="display-icon-error">
                      <AiOutlineComment title="Observaciones" size={"1.5rem"} />
                    </span>
                  </label>
                  <textarea
                    placeholder="Ingresar obervaciones adicionales"
                    defaultValue={dataDB.descripcion}
                    onChange={handleChange}
                    className="rounded-r-full p-3 w-[100%] outline-blue-800"
                    name="descripcion"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceForm;

import { Layout } from "@/components/Layout";
import { useMemo } from "react";
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
} from "react-icons/ai";
import { FaHandshake } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import ButtonContainerVertical from "@/components/ButtonContainerVertical";
import Modal from "@/components/Modal";
import FloatButton from "@/components/FloatButton";
import EnumButtons from "@/components/EnumButtons";
import {
  BsFillHouseFill,
  BsFillPersonCheckFill,
  BsFillPersonFill,
  BsFillPhoneFill,
  BsFillTelephoneFill,
  BsLink,
  BsListCheck,
} from "react-icons/bs";
import useLeadId from "@/client/hooks/share/leads/useLeadId";
import useDeviceId from "@/client/hooks/atic/devices/useDeviceId";
import EnumButtonsIcons from "@/components/EnumButtonsIcons";
import { CiBatteryFull } from "react-icons/ci";
import { TbShield } from "react-icons/tb";
import { RiMacbookFill } from "react-icons/ri";
import { IDevice } from "@/client/models/IDevice";

const DeviceTTLockForm = ({
  data,
  handleChange,
}: {
  data: IDevice;
  handleChange: (values: any) => void;
}) => {
  return (
    <div className="grid grid-cols-3 space-x-2">
      <div className=" w-full flex text-sm">
        <label className="px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full">
          <RiMacbookFill title="MAC" size={"1.2rem"} />
        </label>
        <input
          placeholder="MAC"
          value={data.mac}
          onChange={handleChange}
          type="text"
          name="mac"
          className="rounded-r-full p-2 w-[85%] outline-blue-800"
        />
      </div>
      <div className=" w-full flex text-sm">
        <label className="px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full">
          <TbShield title="Codigo Permanente" size={"1.2rem"} />
        </label>
        <input
          placeholder="Codigo Permanente"
          value={data.codigo_permanente}
          onChange={handleChange}
          type="text"
          name="codigo_permanente"
          className="rounded-r-full p-2 w-[85%] outline-blue-800"
        />
      </div>
      <div className=" w-full flex text-sm">
        <label className="px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full">
          <CiBatteryFull title="Bateria" size={"1.2rem"} />
        </label>
        <input
          placeholder="Bateria"
          value={data.bateria}
          onChange={handleChange}
          type="number"
          name="bateria"
          className="rounded-r-full p-2 w-[85%] outline-blue-800"
        />
      </div>
    </div>
  );
};

export default DeviceTTLockForm;

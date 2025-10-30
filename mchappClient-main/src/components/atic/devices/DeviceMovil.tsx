import { Layout } from '@/components/Layout'
import { useMemo } from 'react'
import React from 'react'
import { ALERT_DANGER, CITIES, STATES, TIPO_LEADS } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import { AiOutlinePlus, AiFillSave, AiOutlineClose, AiOutlineWhatsApp, AiOutlineMail, AiOutlineComment, AiOutlineMobile, AiOutlineWeibo, AiOutlineWifi} from 'react-icons/ai'
import { FaHandshake } from 'react-icons/fa'
import { MdCancel } from 'react-icons/md'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import Modal from '@/components/Modal'
import FloatButton from '@/components/FloatButton'
import EnumButtons from '@/components/EnumButtons'
import { BsFillHouseFill, BsFillPersonCheckFill, BsFillPersonFill, BsFillPhoneFill, BsFillTelephoneFill, BsLink, BsListCheck } from 'react-icons/bs'
import useLeadId from '@/client/hooks/share/leads/useLeadId'
import useDeviceId from '@/client/hooks/atic/devices/useDeviceId'
import EnumButtonsIcons from '@/components/EnumButtonsIcons'
import { IDevice } from '@/client/models/IDevice'

const DeviceMovil = ({ data, handleChange }: { data: IDevice, handleChange: (values: any) => void }) => {
    return (
        <>
            <div className='grid grid-cols-3 space-x-2'>
                <div className="w-full flex text-sm">
                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full'>
                        <AiOutlineMobile title='version_app' size={'1.2rem'} />
                    </label>
                    <input 
                        placeholder='Version App' 
                        value={data.version_app} 
                        onChange={handleChange} 
                        type="text" 
                        name='version_app' 
                        className="rounded-r-full p-2 w-[85%] outline-blue-800" 
                    />
                </div>
            </div>

            <div className='grid grid-cols-3 space-x-2'>
                <div className="w-full flex text-sm">
                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full'>
                        <AiOutlineWeibo title='IP' size={'1.2rem'} />
                    </label>
                    <input 
                        placeholder='IP' 
                        value={data.ip} 
                        onChange={handleChange} 
                        type="text" 
                        name='ip' 
                        className="rounded-r-full p-2 w-[85%] outline-blue-800" 
                    />
                </div>
            </div>

            <div className='grid grid-cols-3 space-x-2'>
                <div className="w-full flex text-sm">
                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full'>
                        <AiOutlineWifi title='MACWIFI' size={'1.2rem'} />
                    </label>
                    <input 
                        placeholder='MACWIFI' 
                        value={data.macwifi} 
                        onChange={handleChange} 
                        type="text" 
                        name='macwifi' 
                        className="rounded-r-full p-2 w-[85%] outline-blue-800" 
                    />
                </div>
            </div>
        </>
    );
};

export default DeviceMovil;

import { useMemo } from 'react'
import React from 'react'
import { ALERT_DANGER } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import { AiOutlinePlus } from 'react-icons/ai'
import EnumButtonsIcons from '@/components/EnumButtonsIcons'
import useAsociarDevice from '@/client/hooks/da/pisos/devices/useAsociarDevice'
import { AsociarDevicesToPisoType } from '@/client/types/globalTypes'
import DeviceTag from '@/components/share/devices/DeviceTag'
import { BiDevices, BiMapPin } from 'react-icons/bi'
import SpinnerCustom from '@/components/SpinnerCustom'
import { BsFillHouseFill } from 'react-icons/bs'

const AsociarDeviceContainer = ({ dataDB, setDataDB }: { dataDB: AsociarDevicesToPisoType, setDataDB: any }) => {

    const {
        errorValidate,
        msgError,
        listTypeDevices,
        handleChangeDevice,
        flagTypeDevices,
        setFlagTypeDevices,
        lstDispositivos,
        deviceSelForm,
        loadingLstDevices,
        handleAddDevice,
        handleChangeStateDevice
    } = useAsociarDevice(dataDB, setDataDB)
    

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    return (
        <div className="w-auto min-h-[10rem] grid grid-flow-col">
            <div className="w-[80rem] w-min-[80rem] min-h-[10rem] pl-[6rem]">
                <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
                    { errorValidate ?
                        <AlertContainer typeAlert={ALERT_DANGER}>
                            <div dangerouslySetInnerHTML={{ __html: msgError }} />
                        </AlertContainer>:<></>
                    }
                    <input type="hidden" name='id' value={dataDB.id?.toString()} />
                    <div className="min-h-[30rem] grid grid-cols-2m space-x-5">
                        <div className="h-full grid space-y-5">
                            <div className=" min-h-[14rem] bg-[#5da7d5c0] rounded-2xl p-5 space-y-4">
                                <h1 className='text-lg text-[#0077bd] font-bold'>Asociar dispositivos</h1>

                                <div className=" w-full flex text-sm">
                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                        <span className='display-icon-error'>
                                            <BsFillHouseFill title='Piso' size={'1.2rem'} />
                                        </span>
                                    </label>
                                    <label className="rounded-r-full p-2 w-[70%] col-span-6 bg-white">{dataDB.etiqueta}</label>
                                </div>

                                <div className=" w-full flex text-sm">
                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                        <span className='display-icon-error'>
                                            <BiMapPin title='Direccion' color='white' size={'1rem'} />
                                        </span>
                                    </label>
                                    <label className="rounded-r-full p-2 w-[70%] col-span-6 bg-white">{dataDB.full_direccion}</label>
                                </div>

                                <hr className='py-1' />

                                <div className='grid space-x-2'>
                                    <div className="flex text-sm">
                                        <EnumButtonsIcons txtSize='sm' values={listTypeDevices} selected={flagTypeDevices} setSelected={setFlagTypeDevices} />
                                    </div>
                                </div>

                                <div className=" w-full flex h-[2.5rem]">
                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                        <BiDevices title="Dispositivos" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                    </label>
                                    <select value={deviceSelForm || 0} onChange={handleChangeDevice} name='device-sel-form' className="rounded-r-full-x rounded-l-full-x p-1 w-[33%] col-span-6">
                                        { useMemo(() => drawListOnSelect(lstDispositivos.map(el => ({key: `${el.id}`, name: `${el.type==='lock'?el.codigo:el.nombre}`})), 'dev', 'Seleccionar dispositivo'), [lstDispositivos]) }
                                    </select>
                                    <label onClick={ handleAddDevice } className={`px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] } text-white rounded-r-full col-span-2`}>
                                        <AiOutlinePlus title={`Agregar dispositivo`} size={'1.2rem'} /> 
                                    </label>
                                    {
                                        ( loadingLstDevices === undefined ) ? '' : (loadingLstDevices) ? <span className='mt-2 ml-2'><SpinnerCustom msn='' /></span> : ''
                                    }
                                </div>

                                <div>
                                    <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4">
                                        <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">Dispositivos</legend>
                                        {
                                            dataDB.dispositivos.length !== 0 ? 
                                            <div className='flex space-x-2'>
                                                {
                                                    dataDB.dispositivos.map((el, index) => {
                                                        return <DeviceTag handleChangeStateDevice={handleChangeStateDevice} key={`dev-${index}`} item={el} />
                                                    })
                                                }
                                            </div>
                                            :
                                            <div className="ml-5">No hay dispositivos <span>&#128549; &#128549;</span>!!</div>
                                        }
                                    </fieldset>

                                    {
                                        dataDB.dispositivos.filter( el => el.action === 'delete' ).length !== 0 ?
                                            <div className='grid space-x-2'>
                                                <div className=" w-full flex text-lg">
                                                    <label className='px-3 py-3 h-auto w-full rounded-l-full1 col-span-2'>
                                                        <b className='txt-red-c62608'>Importante:</b> <b>{ dataDB.dispositivos.filter( el => el.action === 'delete' ).length } </b> dispositivos serán removidos del piso <b>{`${dataDB.etiqueta}`}</b>
                                                    </label>
                                                </div>
                                            </div>
                                        : ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AsociarDeviceContainer
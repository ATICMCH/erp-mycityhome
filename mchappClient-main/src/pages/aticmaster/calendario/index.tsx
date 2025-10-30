import { Layout } from "@/components/Layout";
import React, { useState } from "react";
import MenuLeftContainer from "@/components/MenuLeftContainer";
import { menu_atic_master } from "@/client/helpers/constants";
import ContentContainer from "@/components/ContentContainer";

const CalendarioAticMaster = () => {
    const _itemSelected = 'atic_calendario'
    const [calendarioActivo, setCalendarioActivo] = useState('completo')

    const calendarios = {
        completo: {
            title: "Vista Completa (Múltiples Calendarios)",
            src: "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Europe%2FMadrid&showPrint=0&src=Y185YWY2YTA2ZWEzYzRkY2YzMDhjMGI4MGJhMTQzOGRkYTVmMTk4ZGVlZGJkMjUxZjI5ZWM2YzU1ZWZhYzcwY2M4QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&src=YXRpYzFAbXljaXR5aG9tZS5lcw&color=%23f4511e&color=%23e4c441",
            style: { border: "solid 1px #777" }
        },
        atic1: {
            title: "Calendario ATIC Principal",
            src: "https://calendar.google.com/calendar/embed?src=atic1%40mycityhome.es&ctz=Europe%2FMadrid",
            style: { border: 0 }
        },
        grupo: {
            title: "Calendario Personal",
            src: "https://calendar.google.com/calendar/embed?src=Y185YWY2YTA2ZWEzYzRkY2YzMDhjMGI4MGJhMTQzOGRkYTVmMTk4ZGVlZGJkMjUxZjI5ZWM2YzU1ZWZhYzcwY2M4QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&ctz=Europe%2FMadrid",
            style: { border: 0 }
        }
    }

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex">
                <MenuLeftContainer data={menu_atic_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <div className="w-full">
                        <h1 className="text-2xl font-bold mb-4 text-white">Calendario ATIC Master</h1>
                        
                        {/* Tabs de selección */}
                        <div className="mb-4">
                            <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg">
                                {Object.entries(calendarios).map(([key, cal]) => (
                                    <button
                                        key={key}
                                        onClick={() => setCalendarioActivo(key)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                            calendarioActivo === key
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {cal.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Calendario seleccionado */}
                        <div className="bg-white rounded-lg p-4 shadow-lg">
                            <h2 className="text-lg font-semibold mb-3 text-gray-800">
                                {calendarios[calendarioActivo as keyof typeof calendarios].title}
                            </h2>
                            <iframe 
                                src={calendarios[calendarioActivo as keyof typeof calendarios].src}
                                style={calendarios[calendarioActivo as keyof typeof calendarios].style}
                                width="100%" 
                                height="600" 
                                frameBorder="0" 
                                scrolling="no"
                                title={`Calendario ATIC Master - ${calendarios[calendarioActivo as keyof typeof calendarios].title}`}
                            />
                        </div>
                    </div>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default CalendarioAticMaster;
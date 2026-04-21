import React from 'react'
import { IInfoPisoComercial } from '@/client/models/IInfoPisoComercial'
import PComercialList from './PComercialList'

interface Props {
    items: IInfoPisoComercial[]
}

const PComercialGroupedList: React.FC<Props> = ({ items }) => {
    
    // Agrupar pisos por ciudad MANTENIENDO el formato original
    const groupedData = React.useMemo(() => {
        const groups: { [key: string]: IInfoPisoComercial[] } = {}
        
        items.forEach(piso => {
            let ciudad = piso.a_localidad || 'Sin especificar'
            
            // CAMBIAR "Marbella" por "Sol"
            if (ciudad.toLowerCase() === 'marbella') {
                ciudad = 'Sol'
            }
            
            if (!groups[ciudad]) {
                groups[ciudad] = []
            }
            
            groups[ciudad].push(piso)
        })
        
        return groups
    }, [items])

    return (
        <div className="w-full">
            {Object.entries(groupedData).map(([ciudad, pisos]) => (
                <div key={ciudad} className="mb-8">
                    {/* Header de la ciudad */}
                    <div className="bg-blue-100 p-4 rounded-lg border-b-2 border-blue-300">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-blue-800">
                                📍 {ciudad}
                            </h2>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                {pisos.length} pisos
                            </span>
                        </div>
                    </div>

                    {/* Lista de pisos CADA UNO EN SU PROPIA CASILLA */}
                    <div className="space-y-4 mt-4">
                        {pisos.map((piso) => (
                            <div key={piso.id} className="bg-white rounded-lg shadow-md border border-gray-200">
                                <PComercialList items={[piso]} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PComercialGroupedList
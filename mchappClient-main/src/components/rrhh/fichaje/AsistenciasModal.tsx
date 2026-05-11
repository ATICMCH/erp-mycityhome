/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';

interface AsistenciasModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AsistenciasModal: React.FC<AsistenciasModalProps> = ({ isOpen, onClose }) => {
    const [asistencias, setAsistencias] = useState([]);
    const [filtroUser, setFiltroUser] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [filtroFecha, setFiltroFecha] = useState('');
    const [cargando, setCargando] = useState(false);

    const fetchAsistencias = useCallback(async () => {
        if (!isOpen) return; // Solo carga si el modal está abierto
        
        setCargando(true);
        try {
            const params = new URLSearchParams({
                usuario: filtroUser,
                tipo: filtroTipo,
                fecha: filtroFecha
            });
            const res = await fetch(`http://185.252.233.57:3016/api/rrhh/fichajeoficina?${params}`);
            const json = await res.json();
            setAsistencias(json.data || []);
        } catch (error) {
            console.error("Error cargando asistencias", error);
        } finally {
            setCargando(false);
        }
    }, [filtroUser, filtroTipo, filtroFecha, isOpen]);

    useEffect(() => {
        fetchAsistencias();
    }, [fetchAsistencias]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity">
            {/* Contenedor principal del modal */}
            <div className="bg-white rounded-xl shadow-2xl w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-hidden flex flex-col relative">
                
                {/* Header */}
                <div className="flex justify-between items-center bg-slate-800 p-4 text-white">
                    <h2 className="text-xl font-bold m-0 flex items-center gap-2">
                        📋 Registro de Asistencias
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-white hover:text-red-400 font-bold text-2xl leading-none px-2 transition-colors"
                    >
                        &times;
                    </button>
                </div>

                {/* Filtros */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Usuario</label>
                        <input 
                            type="text" 
                            placeholder="Buscar empleado..." 
                            className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            value={filtroUser} 
                            onChange={(e) => setFiltroUser(e.target.value)}
                        />
                    </div>
                    <div className="w-[150px]">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
                        <select 
                            className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black cursor-pointer"
                            value={filtroTipo} 
                            onChange={(e) => setFiltroTipo(e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            <option value="entrada">Entrada</option>
                            <option value="salida">Salida</option>
                        </select>
                    </div>
                    <div className="w-[160px]">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                        <input 
                            type="date" 
                            className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black cursor-pointer"
                            value={filtroFecha} 
                            onChange={(e) => setFiltroFecha(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={fetchAsistencias}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
                    >
                        Filtrar
                    </button>
                </div>

                {/* Tabla con Scroll */}
                <div className="overflow-y-auto flex-1 p-4 bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-white shadow-sm ring-1 ring-slate-200">
                            <tr>
                                <th className="p-3 text-slate-600 font-bold border-b-2 border-slate-200">Empleado</th>
                                <th className="p-3 text-slate-600 font-bold border-b-2 border-slate-200 text-center">Tipo</th>
                                <th className="p-3 text-slate-600 font-bold border-b-2 border-slate-200 text-center">Fecha</th>
                                <th className="p-3 text-slate-600 font-bold border-b-2 border-slate-200 text-center">Hora</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {cargando ? (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-400 font-medium">Cargando registros...</td></tr>
                            ) : asistencias.length > 0 ? (
                                asistencias.map((a: any) => (
                                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-3 text-slate-700 font-medium">{a.usuario}</td>
                                        <td className="p-3 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                a.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {a.tipo}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center text-slate-600">
                                            {a.fecha ? new Date(a.fecha).toLocaleDateString('es-ES') : '-'}
                                        </td>
                                        <td className="p-3 text-center text-blue-600 font-bold font-mono">
                                            {a.hora}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-400 font-medium">No se encontraron registros.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AsistenciasModal;
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
        if (!isOpen) return;
        setCargando(true);
        try {
            const params = new URLSearchParams({
                usuario: filtroUser,
                tipo: filtroTipo,
                fecha: filtroFecha
            });
            
            // CORRECCIÓN: Usamos ruta relativa para evitar bloqueos de CORS
            const res = await fetch(`/api/rrhh/fichajeoficina?${params}`);
            
            if (!res.ok) {
                throw new Error(`Error en servidor: ${res.status}`);
            }

            const json = await res.json();
            setAsistencias(json.data || []);
            
        } catch (error) {
            console.error("Error cargando asistencias:", error);
        } finally {
            setCargando(false);
        }
    }, [filtroUser, filtroTipo, filtroFecha, isOpen]);

    useEffect(() => {
        if(isOpen) fetchAsistencias();
    }, [isOpen, fetchAsistencias]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            {/* Backdrop / Fondo oscuro */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            
            {/* Contenedor del Modal */}
            <div className="relative w-full max-w-4xl mx-auto my-6 z-[10000]">
                <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none max-h-[90vh]">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t bg-slate-800 text-white">
                        <h3 className="text-xl font-semibold">📋 Registro de Asistencias</h3>
                        <button className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={onClose}>
                            <span className="bg-transparent text-white h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                        </button>
                    </div>

                    {/* Filtros */}
                    <div className="p-4 bg-slate-50 border-b flex flex-wrap gap-3 items-end">
                        <div className="flex-1 min-w-[140px]">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Usuario</label>
                            <input type="text" className="w-full p-2 border rounded text-black text-sm" value={filtroUser} onChange={(e) => setFiltroUser(e.target.value)} placeholder="Buscar..." />
                        </div>
                        <div className="w-[120px]">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Tipo</label>
                            <select className="w-full p-2 border rounded text-black text-sm" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                                <option value="todos">Todos</option>
                                <option value="entrada">Entrada</option>
                                <option value="salida">Salida</option>
                            </select>
                        </div>
                        <div className="w-[140px]">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Fecha</label>
                            <input type="date" className="w-full p-2 border rounded text-black text-sm" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700" onClick={fetchAsistencias}>BUSCAR</button>
                    </div>

                    {/* Body / Tabla */}
                    <div className="relative p-4 flex-auto overflow-y-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="p-3 border text-left text-slate-600 text-xs uppercase font-bold">Empleado</th>
                                    <th className="p-3 border text-center text-slate-600 text-xs uppercase font-bold">Tipo</th>
                                    <th className="p-3 border text-center text-slate-600 text-xs uppercase font-bold">Fecha/Hora</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cargando ? (
                                    <tr><td colSpan={3} className="text-center p-10 text-slate-400">Cargando registros...</td></tr>
                                ) : asistencias.length > 0 ? (
                                    asistencias.map((a: any) => (
                                        <tr key={a.id} className="hover:bg-slate-50">
                                            <td className="p-3 border text-sm text-slate-700 font-medium">{a.usuario}</td>
                                            <td className="p-3 border text-center">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${a.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.tipo}</span>
                                            </td>
                                            <td className="p-3 border text-center text-sm text-slate-600 font-mono">
                                                {a.fecha ? new Date(a.fecha).toLocaleDateString('es-ES') : ''} - {a.hora}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={3} className="text-center p-10 text-slate-500 font-medium">No se encontraron registros de asistencia.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AsistenciasModal;
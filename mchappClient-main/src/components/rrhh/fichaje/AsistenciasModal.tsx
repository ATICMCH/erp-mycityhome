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
            
            // Apuntamos al puerto de la API (3016)
            const res = await fetch(`http://185.252.233.57:3016/api/rrhh/fichajeoficina?${params}`);
            
            if (!res.ok) throw new Error(`Error: ${res.status}`);

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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative w-full max-w-4xl mx-auto z-[10000] p-4">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                    
                    <div className="flex items-center justify-between p-4 bg-slate-800 text-white">
                        <h3 className="text-lg font-bold m-0">📋 Registros de Asistencia</h3>
                        <button className="text-2xl hover:text-red-400 transition-colors" onClick={onClose}>&times;</button>
                    </div>

                    <div className="p-4 bg-slate-50 border-b flex flex-wrap gap-3 items-end">
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Empleado</label>
                            <input type="text" className="w-full p-2 border rounded text-black text-sm" value={filtroUser} onChange={(e) => setFiltroUser(e.target.value)} placeholder="Nombre..." />
                        </div>
                        <div className="w-[120px]">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Acción</label>
                            <select className="w-full p-2 border rounded text-black text-sm" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                                <option value="todos">Todos</option>
                                <option value="entrada">Entrada</option>
                                <option value="salida">Salida</option>
                            </select>
                        </div>
                        <div className="w-[150px]">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fecha</label>
                            <input type="date" className="w-full p-2 border rounded text-black text-sm" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-bold shadow-md transition-all" onClick={fetchAsistencias}>BUSCAR</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-white">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-slate-100 shadow-sm">
                                <tr>
                                    <th className="p-3 text-left text-slate-600 text-xs font-bold uppercase">Empleado</th>
                                    <th className="p-3 text-center text-slate-600 text-xs font-bold uppercase">Tipo</th>
                                    <th className="p-3 text-center text-slate-600 text-xs font-bold uppercase">Fecha y Hora</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {cargando ? (
                                    <tr><td colSpan={3} className="text-center p-10 text-slate-400">Buscando registros...</td></tr>
                                ) : asistencias.length > 0 ? (
                                    asistencias.map((a: any) => (
                                        <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3 text-sm text-slate-700 font-medium">{a.usuario}</td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${a.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.tipo}</span>
                                            </td>
                                            <td className="p-3 text-center text-sm text-slate-500 font-mono">
                                                {a.fecha ? new Date(a.fecha).toLocaleDateString('es-ES') : ''} | {a.hora}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={3} className="text-center p-10 text-slate-400">Sin resultados.</td></tr>
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
import React, { useState, useContext } from 'react';
import UserContext from '@/client/context/UserContext';

const FichajeBoton = () => {
    const { userData } = useContext(UserContext);
    const [cargando, setCargando] = useState(false);
    const urlApi = 'http://185.252.233.57:3016/api/rrhh/fichajeoficina';

    const registrarAsistencia = async (tipo: 'entrada' | 'salida') => {
        const user = typeof userData === 'function' ? userData() : userData;
        if (!user?.id) return alert("Sesión no válida");

        setCargando(true);
        try {
            const res = await fetch(urlApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idusuario: user.id,
                    usuario: user.nombre_completo || user.nombre || 'Usuario ERP',
                    tipo: tipo
                })
            });

            const result = await res.json();

            if (res.ok) {
                alert(`✅ ${tipo.toUpperCase()} registrada con éxito`);
            } else {
                alert(`⚠️ ${result.error || 'Error al fichar'}`);
            }
        } catch (e) {
            alert("❌ Error de conexión con el servidor");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <button 
                onClick={() => registrarAsistencia('entrada')} 
                disabled={cargando}
                style={{ backgroundColor: '#2e7d32', color: 'white', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', border: 'none' }}
            >
                {cargando ? '...' : 'ENTRADA'}
            </button>
            <button 
                onClick={() => registrarAsistencia('salida')} 
                disabled={cargando}
                style={{ backgroundColor: '#c62828', color: 'white', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', border: 'none' }}
            >
                {cargando ? '...' : 'SALIDA'}
            </button>
        </div>
    );
};

export default FichajeBoton;
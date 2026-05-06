import React, { useState, useContext } from 'react';
import UserContext from '@/client/context/UserContext';

const FichajeBoton = () => {
    const { userData } = useContext(UserContext);
    const [cargando, setCargando] = useState(false);
    const urlApi = 'http://185.252.233.57:3016/api/rrhh/fichajeoficina';

    const registrar = async (tipo: 'entrada' | 'salida') => {
        const user = typeof userData === 'function' ? userData() : userData;
        if (!user?.id) return alert("Error: Usuario no identificado");

        setCargando(true);
        try {
            const ahora = new Date();
            const hoy = ahora.getFullYear() + '-' + 
                        String(ahora.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(ahora.getDate()).padStart(2, '0');
            const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });
            const ts = `${hoy} ${hora}`;

            const res = await fetch(urlApi, {
                method: tipo === 'entrada' ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idusuario: user.id,
                    usuario: user.nombre_completo || user.nombre || 'Usuario',
                    fecha: hoy,
                    [tipo]: ts, // Envía 'entrada' o 'salida'
                    idusuario_ultimo_cambio: user.id,
                    estado: 1,
                    tipo_ejecucion: 'manual',
                    observacion: 'Fichaje manual desde botón',
                    jornada: user.jornada || 'Jornada Completa',
                    horario: user.horario || 'HC'
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert(`✅ ${tipo.toUpperCase()} registrada: ${hora}`);
            } else {
                alert(`⚠️ ${data.error || 'Error en el proceso'}`);
            }
        } catch (e) {
            alert("❌ Error de conexión");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '85%' }}>
            <button onClick={() => registrar('entrada')} disabled={cargando} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                {cargando ? '...' : '✅ Entrar'}
            </button>
            <button onClick={() => registrar('salida')} disabled={cargando} style={{ backgroundColor: '#f44336', color: 'white', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                {cargando ? '...' : '👋 Salir'}
            </button>
        </div>
    );
};

export default FichajeBoton;
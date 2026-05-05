import React, { useState, useContext } from 'react';
import UserContext from '@/client/context/UserContext';

const FichajeBoton = () => {
    const { userData } = useContext(UserContext);
    const [cargando, setCargando] = useState(false);
    const urlApi = 'http://185.252.233.57:3016/api/rrhh/fichajeoficina';

    const registrarFichaje = async (tipo: 'entrada' | 'salida') => {
        const currentUser = typeof userData === 'function' ? userData() : userData;
        if (!currentUser?.id) return alert("Sesión no encontrada");

        setCargando(true);
        try {
            const ahora = new Date();
            const hoy = ahora.toISOString().split('T')[0];
            const horaActual = ahora.toLocaleTimeString('es-ES', { hour12: false });
            const timestamp = `${hoy} ${horaActual}`;

            // --- LÓGICA DE ENTRADA ---
            if (tipo === 'entrada') {
                const res = await fetch(urlApi, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        idusuario: currentUser.id,
                        usuario: currentUser.nombre_completo || 'Usuario',
                        fecha: hoy,
                        entrada: timestamp,
                        estado: 1,
                        tipo_ejecucion: 'manual',
                        jornada: currentUser.jornada || 'Jornada Completa',
                        horario: currentUser.horario || 'HC',
                        idusuario_ultimo_cambio: currentUser.id
                    })
                });
                if (res.ok) alert("✅ Entrada registrada: " + horaActual);
                else alert("⚠️ Ya existe un fichaje hoy.");
            } 
            
            // --- LÓGICA DE SALIDA (NUEVA) ---
            else {
                // 1. Obtener todos los registros para buscar el nuestro
                const respGet = await fetch(urlApi);
                const jsonGet = await respGet.json();
                const lista = Array.isArray(jsonGet.data) ? jsonGet.data : [];

                // 2. Buscar el registro abierto de hoy para este usuario
                const registroAbierto = lista.find((f: any) => 
                    String(f.idusuario) === String(currentUser.id) && 
                    String(f.fecha).includes(hoy) && 
                    (f.salida === null || f.salida === '')
                );

                if (!registroAbierto) {
                    alert("⚠️ No tienes una entrada abierta hoy.");
                    setCargando(false);
                    return;
                }

                // 3. Enviamos el objeto completo con la salida actualizada
                const resPut = await fetch(urlApi, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...registroAbierto,
                        salida: timestamp,
                        idusuario_ultimo_cambio: currentUser.id
                    })
                });

                if (resPut.ok) alert("👋 Salida registrada: " + horaActual);
                else alert("❌ Error al procesar la salida.");
            }
        } catch (error) {
            alert("❌ Error de conexión.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => registrarFichaje('entrada')} disabled={cargando} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
                {cargando ? '...' : '✅ Entrar'}
            </button>
            <button onClick={() => registrarFichaje('salida')} disabled={cargando} style={{ backgroundColor: '#f44336', color: 'white', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
                {cargando ? '...' : '👋 Salir'}
            </button>
        </div>
    );
};

export default FichajeBoton;
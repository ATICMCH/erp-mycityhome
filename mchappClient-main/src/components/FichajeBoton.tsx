import React, { useState, useContext } from 'react';
import UserContext from '@/client/context/UserContext';
import FetchApiServiceInstance from '@/client/services/FetchApiService'; // USAMOS TU PROPIA HERRAMIENTA

const FichajeBoton = () => {
    const { userData } = useContext(UserContext);
    const [cargando, setCargando] = useState(false);

    const registrarFichaje = async (tipo: 'entrada' | 'salida') => {
        const currentUser = typeof userData === 'function' ? userData() : userData;

        if (!currentUser || !currentUser.id) {
            alert("No se encontró la sesión del usuario.");
            return;
        }

        setCargando(true);

        try {
            const ahora = new Date();
            const hoy = ahora.getFullYear() + '-' + 
                        String(ahora.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(ahora.getDate()).padStart(2, '0');
            const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });

            const datosCompletos = currentUser as any;
            const nombreUsuario = datosCompletos.nombre_completo || datosCompletos.nombre || datosCompletos.email || 'Usuario ERP';
            const jornada = (datosCompletos.jornada && datosCompletos.jornada !== 'NA') ? datosCompletos.jornada : 'Jornada Completa';
            const horario = (datosCompletos.horario && datosCompletos.horario !== 'NA') ? datosCompletos.horario : 'HC';

            if (tipo === 'entrada') {
                const payload = {
                    idusuario: currentUser.id,
                    usuario: nombreUsuario,
                    fecha: hoy,
                    entrada: `${hoy} ${hora}`,
                    estado: 1,
                    tipo_ejecucion: 'manual',
                    observacion: 'Fichaje manual desde botón',
                    jornada: jornada,
                    horario: horario
                };

                // USAMOS TU CLASE BASE (que ya sabe cómo hablar con tu backend sin CORS)
                const res = await FetchApiServiceInstance.postData('/api/rrhh/fichajeoficina', payload);
                
                if (res) {
                    alert("✅ Entrada registrada correctamente a las " + hora);
                } else {
                    alert("⚠️ No se pudo registrar la entrada. Es posible que ya hayas fichado hoy.");
                }
            } else {
                // SALIDA USANDO TU CLASE BASE
                const res = await FetchApiServiceInstance.putData('/api/rrhh/fichajeoficina', { idusuario: currentUser.id });

                if (res) {
                    alert("👋 Salida registrada correctamente a las " + hora);
                } else {
                    alert("⚠️ Error al registrar la salida.");
                }
            }

        } catch (error) {
            console.error("Error en fichaje:", error);
            alert("❌ Error de conexión al servidor. Revisa la consola.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '85%' }}>
            <button 
                onClick={() => registrarFichaje('entrada')}
                disabled={cargando}
                style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: cargando ? 'wait' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    width: '100%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
            >
                {cargando ? '...' : '✅ Entrar'}
            </button>

            <button 
                onClick={() => registrarFichaje('salida')}
                disabled={cargando}
                style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: cargando ? 'wait' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    width: '100%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
            >
                {cargando ? '...' : '👋 Salir'}
            </button>
        </div>
    );
};

export default FichajeBoton;
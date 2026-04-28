const API_URL = "http://185.252.233.57:3018/api";

class FichajeService {
    async verificarSiYaFicho(idUsuario) {
        try {
            const res = await fetch(`${API_URL}/rrhh/fichajeoficina?idusuario=${idUsuario}`);
            const result = await res.json();
            const hoy = new Date().toISOString().split('T')[0];
            
            // Retorna true si hay algún registro con la fecha de hoy
            return result.data?.some(f => f.fecha && f.fecha.includes(hoy)) || false;
        } catch (e) {
            console.error("Error consultando fichaje:", e);
            return true; // En caso de error, no mostramos el botón por precaución
        }
    }

    async registrarEntrada(authUser) {
        const ahora = new Date();
        const hoy = ahora.toISOString().split('T')[0];
        const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });

        const body = {
            idusuario: authUser.id,
            usuario: authUser.nombre_completo || authUser.username,
            fecha: hoy,
            entrada: `${hoy} ${hora}`,
            estado: 1,
            tipo_ejecucion: 'manual',
            observacion: 'Fichaje manual desde Dashboard',
            jornada: authUser.jornada || 'Jornada Completa',
            horario: authUser.horario || 'HC'
        };

        const response = await fetch(`${API_URL}/rrhh/fichajeoficina`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Token': authUser.token 
            },
            body: JSON.stringify(body)
        });

        return await response.json();
    }
}

export default new FichajeService();
// HEMOS QUITADO EL IMPORT QUE DABA ERROR
const API_BASE = "http://185.252.233.57:3018/api";

class AuthService {
    async login(user, password) {
        console.log("🚀 Intento de login detectado en el cliente");
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, password })
            });

            const result = await response.json();

            if (response.ok && result.data) {
                const authUser = result.data;
                
                // Ejecutamos el fichaje
                await this.registrarFichajeAutomatico(authUser);
                
                return authUser;
            } else {
                throw new Error(result.error || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error("❌ Error en AuthService:", error);
            throw error;
        }
    }

    async registrarFichajeAutomatico(authUser) {
        try {
            const ahora = new Date();
            const hoy = ahora.toISOString().split('T')[0];
            const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });

            console.log("⏱️ Registrando fichaje automático...");

            await fetch(`${API_BASE}/rrhh/fichajeoficina`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Token': authUser.token || '' 
                },
                body: JSON.stringify({
                    idusuario: authUser.id,
                    usuario: authUser.nombre_completo || authUser.username,
                    fecha: hoy,
                    entrada: `${hoy} ${hora}`,
                    estado: 1,
                    tipo_ejecucion: 'automático',
                    observacion: 'Fichaje automático Web Login',
                    jornada: authUser.jornada || 'Jornada Completa',
                    horario: authUser.horario || 'HC'
                })
            });
            console.log("✅ Petición de fichaje enviada");
        } catch (e) {
            console.error("❌ Error en fichaje:", e);
        }
    }
}

export default new AuthService();
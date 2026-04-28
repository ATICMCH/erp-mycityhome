// Hemos quitado el import de ApiConfiguration para evitar el error ERR_MODULE_NOT_FOUND
const API_URL = "http://185.252.233.57:3018/api"; 

class AuthService {
    async login(user, password) {
        console.log("🚀 Iniciando Login para:", user);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, password })
            });

            const result = await response.json();

            if (response.ok && result.data) {
                const authUser = result.data;
                console.log("✅ Login exitoso, lanzando fichaje...");

                // Lanzamos el fichaje sin bloquear el login
                this.registrarFichajeAutomatico(authUser);
                
                return authUser;
            } else {
                throw new Error(result.error || 'Error en la autenticación');
            }
        } catch (error) {
            console.error("❌ Error en AuthService.login:", error);
            throw error;
        }
    }

    async registrarFichajeAutomatico(authUser) {
        try {
            const ahora = new Date();
            const hoy = ahora.toISOString().split('T')[0]; // Formato YYYY-MM-DD
            const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });

            console.log("⏱️ Enviando fichaje automático...");

            const resFichaje = await fetch(`${API_URL}/rrhh/fichajeoficina`, {
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

            if (resFichaje.ok) {
                console.log("✅ Fichaje registrado en DB correctamente.");
            } else {
                console.warn("⚠️ El servidor rechazó el fichaje (posible duplicado).");
            }
        } catch (error) {
            console.error("❌ Error enviando fichaje:", error);
        }
    }
}

export default new AuthService();
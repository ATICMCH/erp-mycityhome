import ApiConfiguration from "./ApiConfiguration.js"; // Añadida extensión .js

class AuthService {
    async login(user, password) {
        try {
            const response = await fetch(`${ApiConfiguration.url}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, password })
            });

            const result = await response.json();

            if (response.ok && result.data) {
                const authUser = result.data;

                // Lanzamos el fichaje y guardamos el usuario en sesión
                this.registrarFichajeAutomatico(authUser);
                
                return authUser;
            } else {
                throw new Error(result.error || 'Error en la autenticación');
            }
        } catch (error) {
            console.error("Error en AuthService.login:", error);
            throw error;
        }
    }

    async registrarFichajeAutomatico(authUser) {
        try {
            const ahora = new Date();
            // Formato YYYY-MM-DD compatible con tu DB
            const hoy = ahora.getFullYear() + '-' + 
                        String(ahora.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(ahora.getDate()).padStart(2, '0');
            const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });

            console.log("⏱️ Enviando fichaje automático para:", authUser.username);

            const resFichaje = await fetch(`${ApiConfiguration.url}/rrhh/fichajeoficina`, {
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
                console.log("✅ Fichaje registrado correctamente.");
            }
        } catch (error) {
            console.error("❌ Error en la llamada de fichaje:", error);
        }
    }
}

export default new AuthService();
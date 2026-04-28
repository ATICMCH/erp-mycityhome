import ApiConfiguration from "./ApiConfiguration.js";

class AuthService {
    async login(user, password) {
        // LOG CRÍTICO: Si no ves esto, el archivo no se ha actualizado en el navegador
        console.log("🚀 AuthService.login ejecutándose para:", user);

        try {
            const response = await fetch(`${ApiConfiguration.url}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, password })
            });

            const result = await response.json();

            if (response.ok && result.data) {
                const authUser = result.data;
                console.log("✅ Login OK en server, iniciando fichaje automático...");

                // FICHAJE AUTOMÁTICO
                await this.registrarFichajeAutomatico(authUser);
                
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
            const hoy = ahora.toLocaleDateString('sv-SE'); // YYYY-MM-DD
            const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });

            console.log("⏱️ Enviando petición de fichaje a la API...");

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

            const responseText = await resFichaje.text();
            console.log("📡 Respuesta del servidor de fichaje:", responseText);

        } catch (error) {
            console.error("❌ Fallo crítico enviando el fichaje:", error);
        }
    }
}

export default new AuthService();
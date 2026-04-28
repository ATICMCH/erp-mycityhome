// ... (imports iguales)

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // PRUEBA DE VIDA: Si no ves esto, el archivo login.tsx no se ha actualizado en el server
    alert("🚀 Intento de login iniciado"); 

    const Response = await userService.authUser(credentials, () => { setIsError(true) })
    
    if (Response && Response.data) {
        const userData = Response.data;
        const _rolMain = userData.roles.find((el: any) => el.ismain === true)

        if (_rolMain) {
            // Intentamos el fichaje con la URL absoluta para evitar errores de ruta
            try {
                const ahora = new Date();
                const hoy = ahora.toISOString().split('T')[0];
                const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });

                // Cambiamos la URL a la IP directa para asegurar el tiro
                await fetch('http://185.252.233.57:3016/api/rrhh/fichajeoficina', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Token': userData.token || '' 
                    },
                    body: JSON.stringify({
                        idusuario: userData.id,
                        usuario: userData.nombre_completo || userData.username,
                        fecha: hoy,
                        entrada: `${hoy} ${hora}`,
                        estado: 1,
                        tipo_ejecucion: 'automático',
                        observacion: 'Fichaje Login Forzado',
                        jornada: userData.jornada || 'Jornada Completa',
                        horario: userData.horario || 'HC'
                    })
                });
                alert("✅ Orden de fichaje enviada");
            } catch (err) {
                console.error(err);
            }

            await setUserData(userData)
            await changeCurrentRol(_rolMain.id)
            localStorage.setItem('idlogin', userData.id.toString())
            router.push('/' + _rolMain.id)
        }
    }
}
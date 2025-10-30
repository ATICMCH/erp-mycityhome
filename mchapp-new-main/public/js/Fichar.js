const Fichar = {
      modalApp: null,
      user: null,
      qr: null,
      token: null,
      apiUrl: null,

      init: (tokenQR, urlServerIn, userLogin, tokenLogin) => {
            Fichar.modalApp = new bootstrap.Modal(document.getElementById('modalEspera'), {})
            Fichar.user = userLogin
            Fichar.qr = tokenQR || ''
            Fichar.token = tokenLogin || ''
            // Cambiar urlServer por la URL del API
            Fichar.apiUrl = urlServerIn.replace(':3017', ':3016')
            console.log('qr: ', Fichar.qr)
            console.log('token: ', Fichar.token)
            Fichar.registrarFichaje()
      },

      registrarFichaje: async () => {
            Fichar.modalApp.show();

            try {
                  const response = await fetch(`${Fichar.apiUrl}/api/share/app/mch/fichar`, {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                              'Token': Fichar.token
                        },
                        body: JSON.stringify({
                              qr: Fichar.qr,
                              ip: ''
                        })
                  });

                  const data = await response.json();

                  setTimeout(() => {
                        Fichar.modalApp.hide();

                        if (response.ok && data.data) {
                              alert('Fichaje registrado correctamente!');
                              location.href = '/';
                        } else {
                              alert('Error al registrar fichaje: ' + (data.error || 'Error desconocido'));
                              location.href = '/';
                        }
                  }, 300);

            } catch (err) {
                  console.error('Error:', err);
                  setTimeout(() => {
                        Fichar.modalApp.hide();
                        alert('Error de conexión. Por favor, intente nuevamente.');
                        location.href = '/';
                  }, 300);
            }
      },

      back: (path = '') => {
            location.href=`/${path}`
      }
}
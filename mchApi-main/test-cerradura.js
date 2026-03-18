/* eslint-disable */
const axios = require('axios');

async function diagnosticoWeLock() {
  console.log("1. Solicitando Token con credenciales de la App WeLock...");
  
  // Probamos los dos servidores principales (Global y Europa)
  const servers = ['https://api.ttlock.com', 'https://euapi.ttlock.com'];
  
  for (let server of servers) {
      console.log(`\n--- Probando servidor: ${server} ---`);
      
      // Formateamos los datos exactamente como los exige el servidor de WeLock
      const params = new URLSearchParams();
      params.append('clientId', 'WELOCK1808071501');
      params.append('clientSecret', '12b7de42b015e9db');
      params.append('username', 'atic@mycityhome.es');
      params.append('password', '79a76d8afffa8a2006e55869f94ba143');
      params.append('grant_type', 'password');

      try {
        const tokenRes = await axios.post(`${server}/oauth2/token`, params);
        
        // Si el servidor nos rechaza y devuelve un error interno
        if (tokenRes.data.errcode || !tokenRes.data.access_token) {
             console.log("? Rechazado. Motivo:", tokenRes.data);
             continue; // Pasamos a probar el siguiente servidor
        }
        
        const token = tokenRes.data.access_token;
        console.log("? ¡Conexión exitosa! Token generado.");

        console.log("\n2. Buscando cerraduras en este servidor...");
        const locksRes = await axios.get(`${server}/v3/lock/list`, {
          params: {
            clientId: 'WELOCK1808071501',
            accessToken: token,
            pageNo: 1,
            pageSize: 20,
            date: new Date().getTime()
          }
        });

        console.log("?? Cerraduras encontradas:");
        console.dir(locksRes.data, { depth: null });
        return; // Salimos porque ya tuvimos éxito

      } catch (error) {
        console.log("? Error de red HTTP:", error.message);
      }
  }
}

diagnosticoWeLock();
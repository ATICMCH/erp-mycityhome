const axios = require('axios');

async function diagnostico() {
  console.log("1. Solicitando Token...");
  try {
    const tokenRes = await axios.post('https://euapi.ttlock.com/oauth2/token', null, {
      params: {
        clientId: '4c5721390ec94c0c927ec535e5556e8c',
        clientSecret: 'ee914ce9afa35455e214939697b0d7f4',
        username: 'atic2@mycityhome.es',
        password: '62826217e83210c0167e0d024f1cbe06',
        grant_type: 'password'
      }
    });
    
    const token = tokenRes.data.access_token;
    console.log("✅ Token correcto:", token);

    console.log("\n2. Buscando cerraduras en tu cuenta...");
    const locksRes = await axios.get('https://euapi.ttlock.com/v3/lock/list', {
      params: {
        clientId: '4c5721390ec94c0c927ec535e5556e8c',
        accessToken: token,
        pageNo: 1,
        pageSize: 20,
        date: new Date().getTime()
      }
    });

    console.log("🔍 Respuesta de la API:");
    console.dir(locksRes.data, { depth: null });

  } catch (error) {
    console.log("❌ Error en la conexión:", error.response ? error.response.data : error.message);
  }
}

diagnostico();
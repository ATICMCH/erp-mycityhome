const fetch = require('node-fetch');
const path = require('path');
// Load .env explicitly from project folder (handles PM2 cwd differences)
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') })

class ApiConfiguration {
      pathApi
      constructor() {
            const isDev = process.argv.slice(2)[0] === 'dev'
            // Prefer explicit env variables; fallback to localhost:3016 if not defined
            this.pathApi = isDev ? (process.env.API_REST_DEV || 'http://127.0.0.1:3016') : (process.env.API_REST_PROD || 'http://127.0.0.1:3016')
            try { console.log(`[ApiConfiguration] pathApi set to: ${this.pathApi}`) } catch (e) {}
      }
}

const ApiConfigurationInstance = new ApiConfiguration()
Object.freeze(ApiConfigurationInstance)

module.exports = ApiConfigurationInstance
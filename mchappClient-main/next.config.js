/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        pathApiRestClient:
          process.env.NEXT_PUBLIC_API_URL ||
          ((process.argv.slice(2)[0] === 'dev') ? process.env.API_END_POINT_DEV : process.env.API_END_POINT_PROD)
    },
    async rewrites() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ||
          ((process.argv.slice(2)[0] === 'dev') ? process.env.API_END_POINT_DEV : process.env.API_END_POINT_PROD);
        if (!apiUrl) {
          throw new Error('No API URL defined for rewrites. Revisa tus variables de entorno.');
        }
        return [
          {
            source: '/api/:path*',
            destination: `${apiUrl}/api/:path*`,
          },
        ];
    },
    compiler: {
      // Enables the styled-components SWC transform
      styledComponents: true
    }
}

module.exports = nextConfig

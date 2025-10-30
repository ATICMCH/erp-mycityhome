module.exports = {
  apps: [
    {
      name: 'mchapi',
      cwd: __dirname + '/mchApi-main',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3016
      }
    },
    {
      name: 'mchclient',
      cwd: __dirname + '/mchappClient-main',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3018
      }
    },
    {
      name: 'mchnew',
      cwd: __dirname + '/mchapp-new-main',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3017
      }
    },
    {
      name: 'mirilla',
      cwd: __dirname + '/mchapp-new-main/mirilla',
      script: 'node',
      args: 'serverMirilla.js',
      env: {
        NODE_ENV: 'development',
        PORT: 8082
      }
    }
  ]
}

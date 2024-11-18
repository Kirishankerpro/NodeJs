// la commande pour lancer les instances est la suivante après avoir installé pm2 globalement :  pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'app-instance-0',
      script: './www/app.js',
      exec_mode: 'fork',
      max_memory_restart: '200M',
      error_file: './logs/err-0.log',
      out_file: './logs/out-0.log',
      env: {
        PORT: 3001,
      },
    },
    {
      name: 'app-instance-1',
      script: './www/app.js',
      exec_mode: 'fork',
      max_memory_restart: '200M',
      error_file: './logs/err-1.log',
      out_file: './logs/out-1.log',
      env: {
        PORT: 3002,
      },
    },
    {
      name: 'app-instance-2',
      script: './www/app.js',
      exec_mode: 'fork',
      max_memory_restart: '200M',
      error_file: './logs/err-2.log',
      out_file: './logs/out-2.log',
      env: {
        PORT: 3003,
      },
    },
  ],
}

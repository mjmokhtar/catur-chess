module.exports = {
  apps: [
    {
      name: 'oldbook-chess',
      script: 'npx',
      args: 'serve -s dist -l 4173 --single',
      cwd: './',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
    },
  ]
}
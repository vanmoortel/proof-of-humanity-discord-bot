module.exports = {
  apps: [{
    name: 'API',
    script: 'dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'develop',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  },
  {
    script: 'serve',
    env: {
      PM2_SERVE_PATH: 'build/',
      PM2_SERVE_PORT: 8080,
    },
  },
  ],
};

/* PM2 配置 — 宝塔 Node.js 管理器用 */
module.exports = {
  apps: [{
    name: 'galileo-os-api',
    script: 'index.js',
    cwd: __dirname,
    instances: 1,
    autorestart: true,
    max_restarts: 10,
    env: {
      NODE_ENV: 'production',
      PORT: 3100
    }
  }]
};

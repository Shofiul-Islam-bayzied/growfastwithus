module.exports = {
  apps: [{
    name: "growfast",
    script: "dist/index.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 5000
    },
    max_memory_restart: "1G",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "/var/log/pm2/growfast-error.log",
    out_file: "/var/log/pm2/growfast-out.log",
    merge_logs: true,
    watch: false
  }]
};
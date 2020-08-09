module.exports = {
    apps : [{
        name: 'workflow-backend',
        script: 'node',
        interpreter: 'none',
        args: './bin/www',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env_production: {
            NODE_ENV: 'production'
        }
    }]
}
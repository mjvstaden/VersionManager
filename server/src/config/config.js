const path = require('path')

module.exports = {
    port: process.env.PORT || 8081,
    db: {
        database: process.env.DB_NAME || 'version_manager',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'password',
        options: {
            dialect: process.env.DIALECT || 'postgres',
            host: process.env.HOST || 'localhost',
            storage: path.resolve(__dirname, '../../versionmanager.spsql')
        }
    },
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret'
    }
}

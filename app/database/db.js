const Sequelize = require('sequelize');

module.exports = (app) => {
    const db = {};

    const databaseName = process.env.DB_ACADEMICO_DATABASE || process.env.MYSQLDATABASE || "solident_academico";

    let mysqlUrlConfig = {};
    if (process.env.MYSQL_URL) {
        try {
            const mysqlUrl = new URL(process.env.MYSQL_URL);
            mysqlUrlConfig = {
                host: mysqlUrl.hostname,
                port: mysqlUrl.port,
                username: decodeURIComponent(mysqlUrl.username),
                password: decodeURIComponent(mysqlUrl.password),
            };
        } catch (error) {
            throw new Error(`[DATABASE CONFIG] Invalid MYSQL_URL: ${error.message}`);
        }
    }

    // Railway occasionally exposes MYSQLHOST/DB_ACADEMICO_HOST as the full connection URL instead of just the hostname.
    const isMysqlUrl = (value) => typeof value === "string" && /^mysql2?:\/\//i.test(value);
    const misconfiguredHostSource = [process.env.MYSQLHOST, process.env.DB_ACADEMICO_HOST].find(isMysqlUrl);
    let inlineUrlConfig = {};

    if (misconfiguredHostSource) {
        try {
            const inlineUrl = new URL(misconfiguredHostSource);
            inlineUrlConfig = {
                host: inlineUrl.hostname,
                port: inlineUrl.port,
                username: decodeURIComponent(inlineUrl.username),
                password: decodeURIComponent(inlineUrl.password),
            };
            console.warn("[DATABASE CONFIG] MYSQLHOST/DB_ACADEMICO_HOST continha uma URL completa; usando os valores extraídos dela.");
        } catch (error) {
            throw new Error(`[DATABASE CONFIG] MYSQLHOST/DB_ACADEMICO_HOST parece uma URL de conexão inválida: ${error.message}`);
        }
    }

    const host = inlineUrlConfig.host || process.env.MYSQLHOST || mysqlUrlConfig.host || process.env.DB_ACADEMICO_HOST;
    const port = inlineUrlConfig.port || process.env.MYSQLPORT || mysqlUrlConfig.port || process.env.DB_ACADEMICO_PORT || 3306;
    const username = inlineUrlConfig.username || process.env.MYSQLUSER || mysqlUrlConfig.username || process.env.DB_ACADEMICO_USERNAME;
    const password = inlineUrlConfig.password || process.env.MYSQLPASSWORD || mysqlUrlConfig.password || process.env.DB_ACADEMICO_PASSWORD;

    if (!host || !username || !password) {
        throw new Error(
            "[DATABASE CONFIG] Missing database connection variables (MYSQLHOST/DB_ACADEMICO_HOST, MYSQLUSER/DB_ACADEMICO_USERNAME, MYSQLPASSWORD/DB_ACADEMICO_PASSWORD)."
        );
    }

    const sequelize = new Sequelize(databaseName, username, password, {
        host,
        port,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    })

    db.sequelize = sequelize
    db.Sequelize = Sequelize

    return db;

}
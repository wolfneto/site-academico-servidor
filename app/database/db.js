const Sequelize = require('sequelize');

module.exports = (app) => {
    const db = {};

    const sequelize = new Sequelize(
        process.env.DB_NAME || "site_academico",
        process.env.DB_USER || "root",
        process.env.DB_PASSWORD || "AS#cc69-4943-bb*du",
        {
        host: process.env.DB_HOST || "45.231.133.250",
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        dialect: 'mysql',
        // dialectOptions: {
        //     dateStrings: true,
        //     typeCast: true
        // },
        //timezone: '-02:00', //for writing to database
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
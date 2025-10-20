const Sequelize = require('sequelize');

module.exports = (app) => {
    const db = {};

    const sequelize = new Sequelize("solident_academico", "solident", "Sol!15King", {
        host: "mysql.solident.com.br",
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
const Sequelize = require('sequelize');

module.exports = (app) => {
    const db = {};

    const sequelize = new Sequelize(
        process.env.DB_NAME || "site_academico",
        process.env.DB_USER || "root",
        process.env.DB_PASSWORD || "AS#cc69-4943-bb*du",
        {
        host: process.env.DB_HOST || "127.0.0.1",
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

    // Test connection
    sequelize.authenticate()
        .then(() => {
            console.log(`[DATABASE] ✓ Connection successful: ${process.env.DB_NAME || 'site_academico'}@${process.env.DB_HOST || 'mysql'}`);
        })
        .catch((error) => {
            console.error(`[DATABASE ERROR] ✗ Connection failed:`, error.message);
        });

    // Sync models after delay to allow all models to be loaded
    setTimeout(() => {
        sequelize.sync({ alter: true })
            .then(() => {
                console.log(`[DATABASE] ✓ Models synced: ${process.env.DB_NAME || 'site_academico'}`);
            })
            .catch((error) => {
                console.error(`[DATABASE ERROR] ✗ Sync failed:`, error.message);
            });
    }, 2000);

    return db;

}
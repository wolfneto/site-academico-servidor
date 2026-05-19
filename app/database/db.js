const Sequelize = require('sequelize');

module.exports = (app) => {
const db = {};

const sequelize = new Sequelize(
process.env.DB_NAME || "site_academico",
process.env.DB_USER || "solident",
process.env.DB_PASSWORD || "Sol!15King",
{
host: process.env.DB_HOST || "mysql",
port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
dialect: 'mysql',
dialectOptions: {
charset: 'utf8mb4'
},
hooks: {
afterConnect: (connection) => {
return new Promise((resolve) => {
connection.query('SET NAMES utf8mb4', () => resolve());
});
}
},
define: {
charset: 'utf8mb4',
collation: 'utf8mb4_unicode_ci'
},
timezone: '-03:00',
pool: {
max: 5,
min: 0,
acquire: 30000,
idle: 10000
}
})

db.sequelize = sequelize
db.Sequelize = Sequelize

sequelize.authenticate()
.then(() => {
console.log(`[DATABASE] ✓ Connection successful: ${process.env.DB_NAME || 'site_academico'}@${process.env.DB_HOST || 'mysql'}`);
})
.catch((error) => {
console.error(`[DATABASE ERROR] ✗ Connection failed:`, error.message);
});

setTimeout(() => {
sequelize.sync({ force: false })
.then(() => {
console.log(`[DATABASE] ✓ Models synced: ${process.env.DB_NAME || 'site_academico'}`);
})
.catch((error) => {
console.error(`[DATABASE ERROR] ✗ Sync failed:`, error.message);
});
}, 2000);

return db;

}

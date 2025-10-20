module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    //status define listas em teste

    const ip_liberado = db.sequelize.define(
        'ip_liberado', {
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        }, ip: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
    }, {
        timestamps: false,
        freezeTableName: true
    });

    obj.ip_liberado = ip_liberado
    obj.sequelize = db.Sequelize;

    return obj;
}
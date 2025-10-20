module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const manutencao = db.sequelize.define(
        'manutencao', {
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            autoincrement: true,
            allowNull: false
        }, manutencao: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        }, msg_manutencao: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
    }, {
        timestamps: false,
        freezeTableName: true
    });

    obj.manutencao = manutencao;
    obj.sequelize = db.Sequelize;
    return obj;
}
module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const kit_academico_item = db.sequelize.define(
        'kit_academico_item', {
        // Model attributes are defined here
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            autoincrement: true,
            allowNull: false
        }, id_kit: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        }, codigo: {
            type: db.Sequelize.STRING,
            allowNull: true
        }, qtd: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        }, descricao: {
            type: db.Sequelize.STRING,
            allowNull: true
        }, valor: {
            type: db.Sequelize.FLOAT,
            allowNull: true
        }
    }, {
        // Other model options go here
        timestamps: false,
        freezeTableName: true
    });

    obj.kit_academico_item = kit_academico_item;
    obj.sequelize = db.Sequelize;
    return obj;
}
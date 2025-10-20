module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const kit_academico_formas_pagamento = db.sequelize.define(
        'kit_academico_formas_pagamento', {
        // Model attributes are defined here
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            autoincrement: true,
            allowNull: false
        }, id_kit: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        }, parcela: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        }, valor: {
            type: db.Sequelize.FLOAT,
            allowNull: true
        },
    }, {
        // Other model options go here
        timestamps: false,
        freezeTableName: true
    });

    obj.kit_academico_formas_pagamento = kit_academico_formas_pagamento;
    obj.sequelize = db.Sequelize;
    return obj;
}
const Sequelize = require("sequelize")

module.exports = (app) => {
    const dbAcademico = app.database.db;

    const carteirinha = dbAcademico.sequelize.define('carteirinha', {

        id: {
            type: Sequelize.INTEGER,
            autoincrement:true,
            primaryKey: true,
        },
        id_semestre: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        valor: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        status: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        editado_em: {
            type: Sequelize.DATE,
            allowNull: false
        },
        editado_por: {
            type: Sequelize.STRING,
            allowNull: true
        },
        criado_em: {
            type: Sequelize.DATE,
            allowNull: false
        },
        criado_por: {
            type: Sequelize.STRING,
            allowNull: true
        },
    }, {
        timestamps: false,
        freezeTableName: true,
    });

    return carteirinha;
}
const Sequelize = require("sequelize")

module.exports = (app) => {
    const dbAcademico = app.database.db;
    let obj = {};

    const representantes = dbAcademico.sequelize.define('representante', {

        id_representante: {
            type: Sequelize.INTEGER,
            autoincrement:true,
            primaryKey: true,
        },
        id_faculdade_representante: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        id_semestre_representante: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        nome_representante: {
            type: Sequelize.STRING,
            allowNull: false
        },
        periodo_representante: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status_representante: {
            type: Sequelize.STRING,
            allowNull: true
        },
        situacao_representante: {
            type: Sequelize.STRING,
            allowNull: false
        },
        date_create: {
            type: Sequelize.DATE,
            allowNull: false
        },
        date_format: {
            type: Sequelize.DATE,
            allowNull: true
        },
    }, {
        timestamps: false,
        freezeTableName: true,
    });

    obj.representantes = representantes;
    return obj;
}
const Sequelize = require("sequelize")

module.exports = (app) => {
    const dbAcademico = app.database.db;
    let obj = {};

    const periodos = dbAcademico.sequelize.define('periodo', {

        id_periodo: {
            type: Sequelize.INTEGER,
            autoincrement:true,
            primaryKey: true,
        },
        id_faculdade_periodo: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        id_semestre_periodo: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        nome_periodo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        cod_periodo: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        status_periodo: {
            type: Sequelize.STRING,
            allowNull: true
        },
        situacao_periodo: {
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

    obj.periodos = periodos;

    return obj;
}
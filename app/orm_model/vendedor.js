const Sequelize = require("sequelize")

module.exports = (app) => {
    const dbAcademico = app.database.db;
    
    let obj = {};

    const vendedores = dbAcademico.sequelize.define('vendedor', {

        id_vendedor: {
            type: Sequelize.INTEGER,
            autoincrement:true,
            primaryKey: true,
        },
        id_faculdade_vendedor: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        id_semestre_vendedor: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        id_periodo_vendedor: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        id_cod_periodo_vendedor: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        nome_vendedor: {
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

    obj.vendedores = vendedores;

    return obj;
}
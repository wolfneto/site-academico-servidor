const Sequelize = require("sequelize")

module.exports = (app) => {
    const dbAcademico = app.database.db;

    const Estrangeiro = dbAcademico.sequelize.define('cpfs_gerados_estrangeiros', {
        id: {
            autoIncrement: true,
            type: dbAcademico.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        cpf: {
            type: Sequelize.STRING,
        },
        nome: {
            type: Sequelize.STRING,
        },
        pedido: {
            type: Sequelize.STRING,
        },
    }, {
        timestamps: false,
        freezeTableName: true,
    });

    return Estrangeiro;
}
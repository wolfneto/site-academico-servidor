const Sequelize = require("sequelize")

module.exports = (app) => {
    const dbAcademico = app.database.db;

    const aluno_endereco_entrega = dbAcademico.sequelize.define('aluno_endereco_entrega', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        cpf_aluno: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        cep: {
            type: Sequelize.STRING,
            allowNull: true
        },
        endereco: {
            type: Sequelize.STRING,
            allowNull: false
        },
        numero: {
            type: Sequelize.STRING,
            allowNull: false
        },
        complemento: {
            type: Sequelize.STRING,
            allowNull: true
        },
        bairro: {
            type: Sequelize.STRING,
            allowNull: true
        },
        cidade: {
            type: Sequelize.STRING,
            allowNull: true
        },
        estado: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true,
    });

    return aluno_endereco_entrega;
}
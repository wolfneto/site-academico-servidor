const Sequelize = require("sequelize")

module.exports = (app) => {
    const dbAcademico = app.database.db;

    const Aluno = dbAcademico.sequelize.define('aluno', {

        cpf: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        senha: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false
        },
        sobrenome: {
            type: Sequelize.STRING,
            allowNull: false
        },
        grupo: {
            type: Sequelize.STRING,
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true
        },
        telefone: {
            type: Sequelize.STRING,
            allowNull: true
        },
        celular: {
            type: Sequelize.STRING,
            allowNull: true
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
        },
        faculdade: {
            type: Sequelize.STRING,
            allowNull: false
        },
        semestre: {
            type: Sequelize.STRING,
            allowNull: true
        },
        periodo: {
            type: Sequelize.STRING,
            allowNull: true
        },
        contato: {
            type: Sequelize.STRING,
            allowNull: true
        },
        vendedor: {
            type: Sequelize.STRING,
            allowNull: true
        },
        ra: {
            type: Sequelize.STRING,
            allowNull: true
        },
        pontos: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        token_firebase: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: true
        },
        nascimento: {
            type: Sequelize.STRING,
            allowNull: true
        },
        obj_consulta_cpf_receita: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        timestamps: false,
        freezeTableName: true,
    });

    return Aluno;
}
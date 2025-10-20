const Sequelize = require("sequelize");

module.exports = (app) => {
    const dbAcademico = app.database.db;

    const Pedidos = dbAcademico.sequelize.define('pedidos', {
        id_pedidos: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        cpf_aluno: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        pedido_dcinfo: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        data_pedido_dcinfo: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        data_pedido: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        hora_pedido: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        emitido: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        status: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        status_aluno: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        comentario: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        grupo: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        faculdade: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        semestre: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        periodo: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        contato: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        acrescimo: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        valor_total: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        itens_total: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        valor_frete: {
            type: Sequelize.FLOAT,
            allowNull: true,
        },
        valor_faturado: {
            type: Sequelize.FLOAT,
            allowNull: true,
        },
        faturado_em: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        removido: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        vendedor: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        pagamento_online: {
            type: Sequelize.TINYINT,
            allowNull: false,
        },
        rastreio: {
            type: Sequelize.TINYINT,
            allowNull: false,
        },
        temporario: {
            type: Sequelize.TINYINT,
            allowNull: false,
        },
        reserva: {
            type: Sequelize.TINYINT,
            allowNull: false,
        },
        cobranca_outros: {
            type: Sequelize.TINYINT,
            allowNull: true
        },
        entregue: {
            type: Sequelize.TINYINT,
            allowNull: false,
        },
        entregue_em: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        entregue_por: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        pontos_inseridos: {
            type: Sequelize.TINYINT,
            allowNull: false,
        },
        id_kit: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        valor_desconto: {
            type: Sequelize.FLOAT,
            allowNull: true,
        },
        novo_pedido: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        desconto_representantes: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        }
    }, {
        timestamps: false,
        freezeTableName: true,
    });

    return Pedidos;

};
module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const semestre_pagamento = db.sequelize.define('semestre_pagamento', {

        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_semestre: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        credito: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        },
        dois_cartoes: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        },
        boleto: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        },
        outros: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        },
        pix: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        },
        max_parcelas: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        desconto_boleto: {
            type: db.Sequelize.FLOAT,
            allowNull: false
        },
        desconto_pix: {
            type: db.Sequelize.FLOAT,
            allowNull: true
        },
        valor_minimo_boleto: {
            type: db.Sequelize.FLOAT,
            allowNull: false
        },
        max_boleto_por_cpf: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        valor_entrada: {
            type: db.Sequelize.FLOAT,
            allowNull: false
        },
        banco_boleto: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        banco_credito: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        banco_pix: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        iugu: {
            type: db.Sequelize.BOOLEAN,
            allowNull: true
        }

    }, {
        timestamps: false,
        freezeTableName: true,
    });

    const parcelas_pagamento_credito = db.sequelize.define('parcelas_pagamento_credito', {
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_semestre: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        valor_de: {
            type: db.Sequelize.FLOAT,
            allowNull: false
        },
        valor_ate: {
            type: db.Sequelize.FLOAT,
            allowNull: false
        },
        qtd_parcela: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        acrescimo: {
            type: db.Sequelize.FLOAT,
            allowNull: false
        },

    }, {
        timestamps: false,
        freezeTableName: true,
    });

    obj.semestre_pagamento = semestre_pagamento;
    obj.parcelas_pagamento_credito = parcelas_pagamento_credito
    obj.sequelize = db.Sequelize;

    return obj;
}
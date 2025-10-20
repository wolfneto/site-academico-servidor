module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const Pagamentos = db.sequelize.define('pagamentos', {

        id_pagamento: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_pedido: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        tipo_pagamento: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        status_pagamento: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        iugu: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
    }, {
        timestamps: false,
        freezeTableName: true,
    });

    const Boleto = db.sequelize.define('pagamentos_boleto', {

        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
        },
        id_pedido: {
            type: db.Sequelize.INTEGER,
        },
        payment_id: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        amount: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        desconto: {
            type: db.Sequelize.FLOAT,
            allowNull: false
        },
        status: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        boleto_id: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        bank: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        status_label: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        typeful_line: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        bar_code: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        issue_date: {
            type: db.Sequelize.DATE,
            allowNull: false
        },
        expiration_date: {
            type: db.Sequelize.DATE,
            allowNull: false
        },
        received_at: {
            type: db.Sequelize.DATE,
            allowNull: false
        },
        our_number: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        document_number: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        boleto_pdf: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        boleto_html: {
            type: db.Sequelize.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true,
    });

    const Credito = db.sequelize.define('pagamentos_cartao_credito', {

        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
        },
        id_pedido: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
        },
        payment_id: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        acquirer_transaction_id: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        terminal_nsu: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        amount: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        status: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        number_installments: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        bandeira: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        authorization_code: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        authorized_at: {
            type: db.Sequelize.DATE,
            allowNull: false
        },
        received_at: {
            type: db.Sequelize.DATE,
            allowNull: false
        },
        confirm_date: {
            type: db.Sequelize.DATE,
            allowNull: false
        },
        canceled_at: {
            type: db.Sequelize.DATE,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true,
    });

    const Pix = db.sequelize.define('pagamentos_pix', {
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_pedido: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        },
        id_pagamento: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        },
        desconto: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        },
        desconto_valor: {
            type: db.Sequelize.FLOAT,
            allowNull: false
        },
        status: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        revisao: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        qrcode: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        txid: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        end_to_end_id: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        valor: {
            type: db.Sequelize.FLOAT,
            allowNull: false
        },
        valor_devolvido: {
            type: db.Sequelize.FLOAT,
            allowNull: true
        },
        chave: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        obs: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        criado_em: {
            type: db.Sequelize.DATE,
            allowNull: false
        },
        pago_em: {
            type: db.Sequelize.DATE,
            allowNull: true
        },
        expira_em: {
            type: db.Sequelize.DATE,
            allowNull: true
        },
        devolvido_em: {
            type: db.Sequelize.DATE,
            allowNull: true
        },
        banco: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
    }, {
        timestamps: false,
        freezeTableName: true,
    });

    obj.Pagamentos = Pagamentos
    obj.Boleto = Boleto
    obj.Credito = Credito
    obj.Pix = Pix

    return obj;
}
const Sequelize = require("sequelize")

module.exports = (app) => {
    const dbAcademico = app.database.db;

    const itemPedidos = dbAcademico.sequelize.define('itempedido', {
        id_item: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        id_item_pedido: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        cod_item: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        produto_millennium: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        qtd_item: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        valor_item: {
            type: Sequelize.FLOAT,
            allowNull: true,
        },
        descri_item: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        marca_item: {
            type: Sequelize.STRING,
            allowNull: true,
        },

    }, {
        timestamps: false,
        freezeTableName: true,
    });

    return itemPedidos;
}
module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const items = db.sequelize.define(
        'item', {
        // Model attributes are defined here
        id_item: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        }, id_lista_item: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        }, descri_item: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, qtd_item: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, obs_item: {
            type: db.Sequelize.STRING,
            allowNull: true
        }, disponivel_item: {
            type: db.Sequelize.STRING,
            allowNull: true
        }, opcional_item: {
            type: db.Sequelize.STRING,
            allowNull: true
        }, outros_item: {
            type: db.Sequelize.STRING,
            allowNull: true
        }, kit_item: {
            type: db.Sequelize.STRING,
            allowNull: true
        }, ordem_item: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        }, trava_qtd_item: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        }, status_image: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        },

    }, {
        // Other model options go here
        timestamps: false,
        freezeTableName: true
    });

    const marcas = db.sequelize.define(
        'marca', {
        // Model attributes are defined here
        id_marca: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        }, id_item_marca: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        }, cod_marca: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, nome_marca: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, valor_marca: {
            type: db.Sequelize.FLOAT,
            allowNull: false
        }, image_path: {
            type: db.Sequelize.STRING,
            allowNull: true
        }, status_marca: {
            type: db.Sequelize.STRING,
            allowNull: true
        }

    }, {
        // Other model options go here
        timestamps: false,
        freezeTableName: true
    });

    obj.marcas = marcas;
    obj.items = items;
    obj.sequelize = db.Sequelize;
    return obj;

}
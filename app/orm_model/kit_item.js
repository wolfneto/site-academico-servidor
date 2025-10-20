module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const kit_items = db.sequelize.define(
        'kit_item', {
        // Model attributes are defined here
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        }, id_item_kit: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        }, qtd_kit: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, descri_kit: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, obs_kit: {
            type: db.Sequelize.STRING,
            allowNull: true
        }, 
    }, {
        // Other model options go here
        timestamps: false,
        freezeTableName: true
    });

    obj.kit_items = kit_items;
    obj.sequelize = db.Sequelize;
    return obj;

}
module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const kit_academico = db.sequelize.define(
        'kit_academico', {
        // Model attributes are defined here
        id_kit: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            autoincrement: true,
            allowNull: false
        }, nome_kit: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, descricao_kit: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, total_kit: {
            type: db.Sequelize.FLOAT,
            allowNull: false
        }, total_itens_kit: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        }, status_kit: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        }, id_faculdade: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        }, id_semestre: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        }, url_image: {
            type: db.Sequelize.STRING,
            allowNull: true
        }, pagamento_online: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        }, date_create: {
            type: db.Sequelize.DATE,
            allowNull: false
        }, date_modify: {
            type: db.Sequelize.DATE,
            allowNull: true
        }

    }, {
        // Other model options go here
        timestamps: false,
        freezeTableName: true
    });

    obj.kit_academico = kit_academico;
    obj.sequelize = db.Sequelize;
    return obj;
}
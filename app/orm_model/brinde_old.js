module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const Brinde = db.sequelize.define(
        'brinde', {
        id_brinde: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        }, id_faculdade_brinde: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        }, id_semestre_brinde: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        }, titulo_brinde: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, mensagem_brinde: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, imagem_path_brinde: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, descri_brinde: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, descri_small_brinde: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, status_brinde: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        }, date_create: {
            type: db.Sequelize.DATE,
            allowNull: false
        }, date_modify: {
            type: db.Sequelize.DATE,
            allowNull: true
        }

    }, {
        timestamps: false,
        freezeTableName: true
    });

    obj.Brinde = Brinde
    obj.sequelize = db.Sequelize;

    return obj;
}
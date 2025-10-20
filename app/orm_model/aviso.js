module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const aviso_geral = db.sequelize.define(
        'aviso_geral', {
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        }, msg: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        modal: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        }

    }, {
        timestamps: false,
        freezeTableName: true
    });

    const aviso = db.sequelize.define(
        'aviso', {
        id_aviso: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        }, id_faculdade_aviso: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        }, id_semestre_aviso: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        }, titulo_aviso: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, mensagem_aviso: {
            type: db.Sequelize.STRING,
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

    obj.aviso_geral = aviso_geral
    obj.aviso = aviso
    obj.sequelize = db.Sequelize;

    return obj;
}
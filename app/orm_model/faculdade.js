module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const faculdades = db.sequelize.define(
        'faculdade', {
        // Model attributes are defined here
        id_faculdade: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        nome_faculdade: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        nome_exibicao_faculdade: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        sigla: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        grupo: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        },
        ordem_site: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        },
        status: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        },
        situacao_faculdade: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        },
        mensagem: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        imagem_path: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        date_create: {
            type: db.Sequelize.DATE,
            allowNull: false
        },
        date_format: {
            type: db.Sequelize.DATE,
            allowNull: true
        },
    }, {
        // Other model options go here
        timestamps: false,
        freezeTableName: true
    });

    obj.faculdades = faculdades;
    obj.sequelize = db.Sequelize;
    return obj;

}
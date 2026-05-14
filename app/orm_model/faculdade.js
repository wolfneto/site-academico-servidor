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
        grupo: {
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
    }, {
        // Other model options go here
        timestamps: false,
        freezeTableName: true
    });

    obj.faculdades = faculdades;
    obj.sequelize = db.Sequelize;
    return obj;

}
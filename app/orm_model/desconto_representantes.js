module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const desconto_representantes = db.sequelize.define('desconto_representantes', {

        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_faculdade: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        },
        id_semestre: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        },
        cpf_aluno: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        desconto_porcentagem: {
            type: db.Sequelize.FLOAT,
            allowNull: true
        },
        desconto_valor: {
            type: db.Sequelize.FLOAT,
            allowNull: true
        },
        valido: {
            type: db.Sequelize.BOOLEAN,
            allowNull: true
        },
        valor_minimo: {
            type: db.Sequelize.FLOAT,
            allowNull: true
        },
    }, {
        timestamps: false,
        freezeTableName: true,
    });

    obj.desconto_representantes = desconto_representantes;
    obj.sequelize = db.Sequelize;

    return obj;
}
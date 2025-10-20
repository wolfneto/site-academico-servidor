module.exports = (app) => {

    const db = app.database.db;
    var obj = {};


    const alteracao_senha_aluno = db.sequelize.define(
        'alteracao_senha_aluno', {
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, hash: {
            type: db.Sequelize.STRING,
            allowNull: true
        }, timer: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, cpf_aluno: {
            type: db.Sequelize.STRING,
            allowNull: false
        }, status: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    obj.alteracao_senha_aluno = alteracao_senha_aluno
    obj.sequelize = db.Sequelize;

    return obj;
}
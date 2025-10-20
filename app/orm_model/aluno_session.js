module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const aluno_session = db.sequelize.define(
        'aluno_session', {
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, cpf_aluno: {
            type: db.Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        session: {
            type: db.Sequelize.TEXT,
            allowNull: false
        }

    }, {
        timestamps: false,
        freezeTableName: true
    });

    obj.aluno_session = aluno_session
    obj.sequelize = db.Sequelize;

    return obj;
}
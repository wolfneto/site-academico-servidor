module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const semestres = db.sequelize.define(
        'semestre', {
        // Model attributes are defined here
        id_semestre: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        id_faculdade_semestre: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        cod_semestre: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        descri_semestre: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        status_semestre: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        },
        situacao_semestre: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        },
        msg_semestre: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        venda_semestre: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        },
        reserva_semestre: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        },
        limite_venda: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        listas_vendidas: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        date_create: {
            type: db.Sequelize.DATE,
            allowNull: false
        },
        format_date: {
            type: db.Sequelize.DATE,
            allowNull: true
        },
        pos_graduacao: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        base_frete: {
            type: db.Sequelize.FLOAT,
            allowNull: true
        },
        valor_minimo_frete: {
            type: db.Sequelize.FLOAT,
            allowNull: false
        },
        valor_minimo_venda: {
            type: db.Sequelize.FLOAT,
            allowNull: false
        }
    }, {
        // Other model options go here
        timestamps: false,
        freezeTableName: true
    });

    obj.semestres = semestres;
    obj.sequelize = db.Sequelize;

    return obj;
}
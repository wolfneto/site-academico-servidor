module.exports = (app) => {

    const db = app.database.db;

    const Brindes = db.sequelize.define(
        'brinde_site', {
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        codigo: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        descricao: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        descricao_site: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        observacao: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        img_path: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        removido: {
            type: db.Sequelize.BOOLEAN,
            allowNull: false
        },
        removido_em: {
            type: db.Sequelize.DATE,
            allowNull: true
        },
        removido_por: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        criado_em: {
            type: db.Sequelize.DATE,
            allowNull: true
        },
        criado_por: {
            type: db.Sequelize.STRING,
            allowNull: true
        }

    }, {
        timestamps: false,
        freezeTableName: true
    });

    const ListasBrinde = db.sequelize.define(
        'brinde_site_listas', {
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        id_faculdade: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        id_semestre: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        codigo: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        status: {
            type: db.Sequelize.BOOLEAN,
            allowNull: true
        },
        descricao_status: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        valor: {
            type: db.Sequelize.DECIMAL,
            allowNull: false
        },
        acumula: {
            type: db.Sequelize.BOOLEAN,
            allowNull: true
        },
        criado_em: {
            type: db.Sequelize.DATE,
            allowNull: true
        },
        criado_por: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        editado_em: {
            type: db.Sequelize.DATE,
            allowNull: true
        },
        editado_por: {
            type: db.Sequelize.STRING,
            allowNull: true
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return {
        Brindes,
        ListasBrinde,
        db
    };
}
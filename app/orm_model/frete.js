module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const zonas = db.sequelize.define(
        'zonas_frete', {
            // Model attributes are defined here
            id: {
                type: db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            nome: {
                type: db.Sequelize.STRING,
                allowNull: false
            },
            status: {
                type: db.Sequelize.BOOLEAN,
                allowNull: false
            },
            multiplicador: {
                type: db.Sequelize.FLOAT,
                allowNull: false
            },
            id_semestre: {
                type: db.Sequelize.INTEGER,
                allowNull: false
            }

        }, {
            // Other model options go here
            timestamps: false,
            freezeTableName: true
        });


    const sub_zonas = db.sequelize.define(
        'sub_zonas_frete', {
            // Model attributes are defined here
            id: {
                type: db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            id_zona_frete: {
                type: db.Sequelize.INTEGER,
                allowNull: false
            },
            nome: {
                type: db.Sequelize.STRING,
                allowNull: false
            },
            status: {
                type: db.Sequelize.BOOLEAN,
                allowNull: false
            },
            multiplicador: {
                type: db.Sequelize.FLOAT,
                allowNull: false
            }

        }, {
            // Other model options go here
            timestamps: false,
            freezeTableName: true
        });

    const setores = db.sequelize.define(
        'setores_frete', {
            // Model attributes are defined here
            id: {
                type: db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            id_sub_zona: {
                type: db.Sequelize.INTEGER,
                allowNull: false
            },
            nome: {
                type: db.Sequelize.STRING,
                allowNull: false
            },
            status: {
                type: db.Sequelize.BOOLEAN,
                allowNull: false
            },
            multiplicador: {
                type: db.Sequelize.FLOAT,
                allowNull: false
            }

        }, {
            // Other model options go here
            timestamps: false,
            freezeTableName: true
        });

    obj.Zonas = zonas;
    obj.Sub_zonas = sub_zonas;
    obj.Setores = setores;
    obj.sequelize = db.Sequelize;

    return obj;
}
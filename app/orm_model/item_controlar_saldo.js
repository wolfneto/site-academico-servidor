module.exports = (app) => {
  const db = app.database.db;
  var obj = {};

  const item_controlar_saldo = db.sequelize.define(
    "item_controlar_saldo",
    {
      id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      codigo: {
        type: db.Sequelize.STRING,
        allowNull: false,
      },
      descricao: {
        type: db.Sequelize.STRING,
        allowNull: false,
      },
      saldo: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: db.Sequelize.BOOLEAN,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  const item_controlar_saida = db.sequelize.define(
    "item_controlar_saida",
    {
      id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      codigo: {
        type: db.Sequelize.STRING,
        allowNull: false,
      },
      qtd: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
      },
      usuario: {
        type: db.Sequelize.STRING,
        allowNull: false,
      },
      data: {
        type: db.Sequelize.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  obj.item_controlar_saldo = item_controlar_saldo;
  obj.item_controlar_saida = item_controlar_saida;
  obj.sequelize = db.Sequelize;

  return obj;
};

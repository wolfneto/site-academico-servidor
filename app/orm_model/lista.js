module.exports = (app) => {
  const db = app.database.db;
  var obj = {};

  const listas = db.sequelize.define(
    "lista",
    {
      // Model attributes are defined here
      id_lista: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoincrement: true,
        allowNull: false,
      },
      id_faculdade_lista: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
      },
      id_semestre_lista: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
      },
      nome_exibi_lista: {
        type: db.Sequelize.STRING,
        allowNull: false,
      },
      nome_lista: {
        type: db.Sequelize.STRING,
        allowNull: false,
      },
      valor_total_lista: {
        type: db.Sequelize.FLOAT,
        allowNull: false,
      },
      total_itens_lista: {
        type: db.Sequelize.STRING,
        allowNull: false,
      },
      status_lista: {
        type: db.Sequelize.STRING,
        allowNull: false,
      },
      situacao_lista: {
        type: db.Sequelize.STRING,
        allowNull: false,
      },
      mostrar_completa: {
        type: db.Sequelize.BOOLEAN,
        allowNull: false,
      },
      economica: {
        type: db.Sequelize.BOOLEAN,
        allowNull: false,
      },
      criado_por: {
        type: db.Sequelize.STRING,
        allowNull: false,
      },
      date_create: {
        type: db.Sequelize.DATE,
        allowNull: false,
      },
      editado_por: {
        type: db.Sequelize.STRING,
        allowNull: false,
      },
      valor_minimo_venda: {
        type: db.Sequelize.FLOAT,
        allowNull: false,
      },
      date_modify: {
        type: db.Sequelize.DATE,
        allowNull: false,
      },
    },
    {
      // Other model options go here
      timestamps: false,
      freezeTableName: true,
    }
  );

  obj.listas = listas;
  obj.sequelize = db.Sequelize;
  return obj;
};

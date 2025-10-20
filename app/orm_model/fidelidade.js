module.exports = (app) => {

    const db = app.database.db;
    var obj = {};

    const produto_fidelidade = db.sequelize.define(
        'produto_fidelidade', {
        // Model attributes are defined here
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        codigo: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        nome: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        tipo: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        descricao_detalhada: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        info_adicional: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        quantidade: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        },
        valor: {
            type: db.Sequelize.FLOAT,
            allowNull: false
        },
        pontos: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        status: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        id_categoria: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        estoque: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        img_url: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        data_de: {
            type: db.Sequelize.DATE,
            allowNull: false
        },
        data_ate: {
            type: db.Sequelize.DATE,
            allowNull: false
        },
        data_limite: {
            type: db.Sequelize.DATE,
            allowNull: true
        },
    }, {
        // Other model options go here
        timestamps: false,
        freezeTableName: true
    });

    const categoria_fidelidade = db.sequelize.define(
        'categoria_fidelidade', {
        // Model attributes are defined here
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        nome_categoria: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
    }, {
        // Other model options go here
        timestamps: false,
        freezeTableName: true
    });

    const aluno_pontos_inseridos = db.sequelize.define(
        'aluno_pontos_inseridos', {
        // Model attributes are defined here
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        id_pedido: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        cpf: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        pontos: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        },
        metodo: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        removido: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        expirado: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        },
        inserido_por: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        inserido_em: {
            type: db.Sequelize.DATE,
            allowNull: false
        },
        removido_por: {
            type: db.Sequelize.STRING,
            allowNull: false
        },
        removido_em: {
            type: db.Sequelize.DATE,
            allowNull: false
        },
        pontos_resgatados: {
            type: db.Sequelize.DATE,
            allowNull: true
        },
    }, {
        // Other model options go here
        timestamps: false,
        freezeTableName: true
    });

    const aluno_resgates = db.sequelize.define(
        'aluno_resgates', {
        // Model attributes are defined here
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        cpf_aluno: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        pedido_dcinfo: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        tipo_resgate: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        status: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        },
        nome_produto: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        valor_produto: {
            type: db.Sequelize.FLOAT,
            allowNull: true
        },
        pontos_produto: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        },
        create_at: {
            type: db.Sequelize.DATE,
            allowNull: true
        },
        id_produto: {
            type: db.Sequelize.INTEGER,
            allowNull: true
        },
        codigo_produto: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        emitido_em: {
            type: db.Sequelize.DATE,
            allowNull: true
        },
        emitido_por: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
        excluido: {
            type: db.Sequelize.INTEGER,
            allowNull: false
        },
        excluido_em: {
            type: db.Sequelize.DATE,
            allowNull: true
        },
        excluido_por: {
            type: db.Sequelize.STRING,
            allowNull: true
        },
    }, {
        // Other model options go here
        timestamps: false,
        freezeTableName: true
    });


    obj.produto_fidelidade = produto_fidelidade;
    obj.categoria_fidelidade  = categoria_fidelidade;
    obj.aluno_pontos_inseridos = aluno_pontos_inseridos;
    obj.aluno_resgates = aluno_resgates;
    obj.sequelize = db.Sequelize;
    return obj;

}
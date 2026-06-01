module.exports = (app) => {
  const crypto = app.utils.crypto;

  const listaModel = app.orm_model.lista;
  const faculdadeModel = app.orm_model.faculdade;
  const semestreModel = app.orm_model.semestre;
  const semestrePagamentoModel = app.orm_model.semestre_pagamento;
  const itemModel = app.orm_model.item;
  const periodoModel = app.orm_model.periodo;
  const vendedorModel = app.orm_model.vendedor;
  const kit_itemModel = app.orm_model.kit_item;
  const brindeModel = app.orm_model.brindes;
  const item_controlar_saldoModel = app.orm_model.item_controlar_saldo;

  listaModel.listas.hasMany(itemModel.items, {
    foreignKey: "id_lista_item",
    sourceKey: "id_lista",
  });
  itemModel.items.hasMany(itemModel.marcas, {
    foreignKey: "id_item_marca",
    sourceKey: "id_item",
  });
  semestreModel.semestres.hasMany(periodoModel.periodos, {
    foreignKey: "id_semestre_periodo",
    sourceKey: "id_semestre",
  });
  periodoModel.periodos.hasOne(vendedorModel.vendedores, {
    foreignKey: "id_periodo_vendedor",
    sourceKey: "id_periodo",
  });
  brindeModel.ListasBrinde.hasOne(brindeModel.Brindes, {
    foreignKey: "codigo",
    sourceKey: "codigo",
    as: "item",
  });

  listaModel.listas.hasMany(semestrePagamentoModel.semestre_pagamento, {
    foreignKey: "id_semestre",
    sourceKey: "id_semestre_lista",
  });

  this.getListas = async function (req, res) {
    try {
      let data = crypto.decrypt(req.body.data, true);

      let id_semestre_lista = data.id_semestre_lista;

      let retorno = await validate(id_semestre_lista);

      if (retorno.valid === false) {
        res.send(crypto.encrypt(retorno, true));
      } else {
        let obj = {
          valid: true,
          hasListaTeste: false,
          semestre: retorno.semestre,
          faculdade: retorno.faculdade,
          listas: [],
          brindes: [],
        };

        let getListas = await listaModel.listas.findAll({
          include: [
            {
              model: itemModel.items,
              include: [{ model: itemModel.marcas }],
            },
            {
              model: semestrePagamentoModel.semestre_pagamento
            }
          ],
          where: {
            id_semestre_lista: {
              [listaModel.sequelize.Op.eq]: id_semestre_lista,
            },
            situacao_lista: {
              [listaModel.sequelize.Op.ne]: "0",
            },
          },
        });

        for (let lista of getListas) {
          firstBy = (function () {
            function e(f) {
              f.thenBy = t;
              return f;
            }

            function t(y, x) {
              x = this;
              return e(function (a, b) {
                return x(a, b) || y(a, b);
              });
            }
            return e;
          })();
          lista.items.sort(
            firstBy(function (v1, v2) {
              return v1.opcional_item - v2.opcional_item;
            }).thenBy(function (v1, v2) {
              return v1.ordem_item - v2.ordem_item;
            })
          );

          // let total = 0.0;
          for (item of lista.items) {
            item.dataValues.descri_item =
              item.dataValues.descri_item.toUpperCase();
            item.dataValues.obs_item =
              item.dataValues.obs_item == undefined
                ? ""
                : item.dataValues.obs_item.toUpperCase();
            if (item.dataValues.disponivel_item == "0") {
              item.dataValues.selected = false;
              item.dataValues.qtd_item = 0;
            } else if (item.dataValues.opcional_item == "0") {
              item.dataValues.selected = true;
              item.dataValues.qtd_item = parseInt(item.dataValues.qtd_item);
              item.dataValues.qtd_item_original = item.dataValues.qtd_item;
            } else {
              item.dataValues.selected = false;
              item.dataValues.qtd_item = 0;
              item.dataValues.qtd_item_original = 0;
            }
            // let marca = item.dataValues.marcas.reduce(function (prev, current) {
            //   if (lista.economica) {
            //     return prev &&
            //       prev.dataValues.valor_marca < current.dataValues.valor_marca
            //       ? prev
            //       : current;
            //   } else {
            //     return prev &&
            //       prev.dataValues.valor_marca > current.dataValues.valor_marca
            //       ? prev
            //       : current;
            //   }
            // });

            item.dataValues.selectedMarca = item.dataValues.marcas[0]

            // total +=
            //   item.dataValues.selectedMarca.valor_marca *
            //   item.dataValues.qtd_item;

            if (
              item.dataValues.marcas[0].status_marca == "2" ||
              item.dataValues.marcas[0].status_marca == "3"
            ) {
              item.dataValues.trocarMarca = true;
            }
          }

          // lista.valor_total_lista = total;

          if (lista.status_lista == "0") {
            obj.hasListaTeste = true;
          }
        }

        obj.listas = getListas;

        let brindes = await brindeModel.ListasBrinde.findAll({
          where: {
            id_semestre: id_semestre_lista,
            status: true
          },
          include: {
            model: brindeModel.Brindes,
            as: "item",
          },
          order: [["valor", "ASC"]],
        });

        obj.brindes = brindes;

        obj.item_controlar_saldo =
          await item_controlar_saldoModel.item_controlar_saldo.findAll();

        res.send(crypto.encrypt(obj, true));
      }
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };

  this.checarInfo = async function (req, res) {
    let data = crypto.decrypt(req.body.data, true);
    let obj = {
      valid: false,
      faculdade: false,
      semestre: false,
      listas: false,
      valorMinimo: false,
    };
    let id_semestre_lista = data.id_semestre_lista;
    let listasCarrinho = data.carrinho.listas;

    if (id_semestre_lista == undefined) {
      obj.valid = false;
      obj.semestre = true;
      res.send(obj);
    }

    let retorno = await validate(id_semestre_lista);

    if (retorno.valid) {
      let listasBase = await listaModel.listas.findAll({
        include: [
          {
            model: itemModel.items,
            include: [{ model: itemModel.marcas }],
          },
          {
            model: itemModel.items,
          },
        ],
        where: {
          id_semestre_lista: {
            [listaModel.sequelize.Op.eq]: id_semestre_lista,
          },
          situacao_lista: {
            [listaModel.sequelize.Op.ne]: "0",
          },
        },
        order: [["nome_exibi_lista", "ASC"]],
      });
      if (!resetListas(listasCarrinho, listasBase)) {
        obj.valid = true;
      } else {
        obj.listas = true;
      }

      let valor_minimo_total = 0;
      let valor_pedido_total = 0;

      for (let listaCarrinho of listasCarrinho) {
        for (let listaBase of listasBase) {
          if (listaCarrinho.id_lista == listaBase.id_lista) {
            valor_pedido_total += parseFloat(listaCarrinho.valor_total_lista);
            valor_minimo_total += parseFloat(listaBase.valor_minimo_venda);
          }
        }
      }

      if (valor_minimo_total > valor_pedido_total) {
        obj.valorMinimo = true;
        obj.valid = false;
      }

      res.send(crypto.encrypt(obj, true));
    } else {
      if (!retorno.semestre) {
        obj.semestre = true;
      } else if (!retorno.faculdade) {
        obj.faculdade = true;
      }
      res.send(crypto.encrypt(obj, true));
    }
  };

  function resetListas(listasCarrinho, listasBase) {
    for (let listaCarrinho of listasCarrinho) {
      listaCarrinho.diff = true;
      for (let listaBase of listasBase) {
        if (listaBase.id_lista == listaCarrinho.id_lista) {
          if (
            JSON.stringify(listaBase.date_modify) ==
              JSON.stringify(listaCarrinho.date_modify) &&
            listaBase.valor_minimo_venda == listaCarrinho.valor_minimo_venda &&
            listaBase.status_lista == listaCarrinho.status_lista
          ) {
            listaCarrinho.diff = false;
          }
        }
      }
    }

    for (let lista of listasCarrinho) {
      if (lista.diff) {
        return true;
      }
    }
    return false;
  }

  async function validate(id_semestre) {
    let obj = { faculdade: false, semestre: false, valid: false };

    if (id_semestre == null) {
      return obj;
    }

    let semestre = await semestreModel.semestres.findOne({
      include: [
        {
          model: periodoModel.periodos,
          where: {
            status_periodo: "1",
            situacao_periodo: "1",
          },
        },
      ],
      where: {
        id_semestre: id_semestre,
      },
    });

    if (
      semestre == null ||
      semestre.status_semestre == 0 ||
      semestre.situacao_semestre == 0
    ) {
      return obj;
    }
    obj.semestre = semestre;

    let faculdade = await faculdadeModel.faculdades.findOne({
      where: {
        id_faculdade: semestre.id_faculdade_semestre,
      },
    });

    if (
      faculdade == null ||
      faculdade.status == 0 ||
      faculdade.situacao_faculdade == 0
    ) {
      return obj;
    }
    obj.faculdade = faculdade;

    obj.valid = true;

    return obj;
  }

  this.getKitItem = async function (req, res) {
    try {
      let id_item = crypto.decrypt(req.query.data, true);

      let kit_item = await kit_itemModel.kit_items.findAll({
        where: {
          id_item_kit: id_item,
        },
        order: [["descri_kit", "ASC"]],
      });

      res.send(crypto.encrypt(kit_item, true));
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };
  return this;
};

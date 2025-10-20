module.exports = (app) => {
  const axios = require("axios");
  const Decimal = require("decimal.js");
  const alunoModel = app.orm_model.aluno;
  const pedidoModel = app.orm_model.pedido;
  const itemPedidoModel = app.orm_model.itemPedido;
  const pagamentosModel = app.orm_model.pagamentos;
  const descontoRepresentantesModel = app.orm_model.desconto_representantes;
  const semestrePagamentoModel = app.orm_model.semestre_pagamento;
  const listaModel = app.orm_model.lista;
  const kitAcademicoFormasPagamentoModel =
    app.orm_model.kit_academico_formas_pagamento;
  const semestreModel = app.orm_model.semestre;
  const estrangeiroModel = app.orm_model.estrangeiro;
  const freteModel = app.orm_model.frete;
  const brindeModel = app.orm_model.brindes;
  const item_controlar_saldoModel = app.orm_model.item_controlar_saldo;

  const crypto = app.utils.crypto;
  const email = app.utils.email;
  const moment = app.utils.moment;

  pedidoModel.hasMany(itemPedidoModel, {
    foreignKey: "id_item_pedido",
    sourceKey: "id_pedidos",
  });
  pedidoModel.hasOne(pagamentosModel.Pagamentos, {
    foreignKey: "id_pedido",
    sourceKey: "id_pedidos",
  });
  pedidoModel.hasOne(pagamentosModel.Boleto, {
    foreignKey: "id_pedido",
    sourceKey: "id_pedidos",
  });
  pedidoModel.hasOne(pagamentosModel.Credito, {
    foreignKey: "id_pedido",
    sourceKey: "id_pedidos",
  });
  pedidoModel.hasOne(pagamentosModel.Pix, {
    foreignKey: "id_pedido",
    sourceKey: "id_pedidos",
  });
  pedidoModel.hasOne(descontoRepresentantesModel.desconto_representantes, {
    foreignKey: "cpf_aluno",
    sourceKey: "cpf_aluno",
  });
  pedidoModel.hasOne(semestrePagamentoModel.semestre_pagamento, {
    foreignKey: "id_semestre",
    sourceKey: "semestre",
  });

  pedidoModel.hasMany(semestrePagamentoModel.parcelas_pagamento_credito, {
    foreignKey: "id_semestre",
    sourceKey: "semestre",
  });

  pedidoModel.hasOne(alunoModel, {
    foreignKey: "cpf",
    sourceKey: "cpf_aluno",
  });

  pedidoModel.hasOne(semestreModel.semestres, {
    foreignKey: "id_semestre",
    sourceKey: "semestre",
    as: "sem",
  });

  semestreModel.semestres.hasMany(freteModel.Zonas, {
    foreignKey: "id_semestre",
    sourceKey: "id_semestre",
  });

  freteModel.Zonas.hasMany(freteModel.Sub_zonas, {
    foreignKey: "id_zona_frete",
    sourceKey: "id",
  });

  freteModel.Sub_zonas.hasMany(freteModel.Setores, {
    foreignKey: "id_sub_zona",
    sourceKey: "id",
  });

  this.salvar = async function (res, req) {
    try {
      let pedido = crypto.decrypt(req.body.data, true);

      let isKit = pedido.kit;

      let emailAluno = pedido.aluno.email;
      let nomeAluno = pedido.aluno.nome;
      let sobrenomeAluno = pedido.aluno.sobrenome;

      let faculdade = pedido.carrinho.faculdade; // aqui ta o obj do faculdade
      let semestre = pedido.carrinho.semestre; // aqui ta o obj do semestre
      let periodo = pedido.aluno.periodo; // aqui ta o obj do periodo;
      let contato = pedido.aluno.contato; // aqui ta o obj do contato;

      let brindesMarcasEscolhidas = pedido.carrinho.brindesMarcas;

      let itemsPedido = [];

      //sera preenchido se houver pelo menos um pedido não pago
      let pedidoNaoPago = await pedidoModel.findOne({
        where: {
          cpf_aluno: pedido.aluno.cpf.replace(/\D/g, ""),
          // pagamento_online: 1,
          temporario: 1,
        },
        include: [{ model: pagamentosModel.Pix }],
      });

      if (faculdade.grupo == 0) {
        //grupo 0 monta o grupo da seguinte forma:
        //código do semestre + primeira letra do periodo + faculdade
        pedido.aluno.grupo =
          semestre.cod_semestre +
          periodo.nome_periodo.charAt(0) +
          " - " +
          faculdade.nome_faculdade.toUpperCase();
      } else if (faculdade.grupo == 1) {
        //grupo 1 monta o grupo da seguinte forma:
        //contato + faculdade
        pedido.aluno.grupo =
          contato.nome_representante +
          " - " +
          faculdade.nome_faculdade.toUpperCase();
      } else if (faculdade.id == 157) {
        pedido.aluno.grupo = "SALDAO"
      }

      pedido.aluno.faculdade = faculdade.id_faculdade;
      pedido.aluno.semestre = semestre.id_semestre;
      pedido.aluno.periodo = periodo.id_periodo;
      pedido.aluno.contato = contato.id_representante;
      pedido.aluno.vendedor = periodo.vendedor.nome_vendedor;

      if (pedido.doCadastro) {
        const hash = await crypto.Bcrypt.hashSync(
          pedido.aluno.senha.trim(),
          crypto.Salt
        );
        pedido.aluno.senha = hash;

        if (pedido.aluno.estrangeiro) {
          let retornoEstrangeiro = await estrangeiroModel.findAll({
            limit: 1,
            order: [["id", "desc"]],
          });
          let cpf_criado = parseInt(retornoEstrangeiro[0].cpf);
          cpf_criado = cpf_criado + 1;
          cpf_criado = cpf_criado.toString().padStart(11, "0");

          pedido.aluno.cpf = cpf_criado;
          pedido.aluno.obj_consulta_cpf_receita = {
            ni: cpf_criado,
            nome:
              pedido.aluno.nome.trim().toUpperCase() +
              " " +
              pedido.aluno.sobrenome.trim().toUpperCase(),
            nascimento: pedido.aluno.nascimento,
            situacao: {
              codigo: 99,
              descricao: "ESTRANGEIRO",
            },
          };

          pedido.aluno.obj_consulta_cpf_receita = JSON.stringify(
            pedido.aluno.obj_consulta_cpf_receita
          );
        } else {
          pedido.aluno.cpf = pedido.aluno.cpf.replace(/\D/g, "");
        }

        pedido.aluno.nome = pedido.aluno.nome
          .trim()
          .toUpperCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        pedido.aluno.sobrenome = pedido.aluno.sobrenome
          .trim()
          .toUpperCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        pedido.aluno.email = pedido.aluno.email
          .trim()
          .toUpperCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        pedido.aluno.endereco = pedido.aluno.endereco
          .trim()
          .toUpperCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        pedido.aluno.numero = pedido.aluno.numero.trim().toUpperCase();
        pedido.aluno.complemento =
          pedido.aluno.complemento != null
            ? pedido.aluno.complemento
                .trim()
                .toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            : pedido.aluno.complemento;
        pedido.aluno.bairro = pedido.aluno.bairro
          .trim()
          .toUpperCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        pedido.aluno.cidade = pedido.aluno.cidade
          .toUpperCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        pedido.aluno.celular = pedido.aluno.celular.replace(/\D/g, "");
        pedido.aluno.telefone = pedido.aluno.telefone.replace(/\D/g, "");
        pedido.aluno.cep = pedido.aluno.cep.replace(/\D/g, "");
        //pedido.aluno.nascimento = moment.formatToDB(pedido.aluno.nascimento)
        pedido.aluno.updated_at = moment.nowDB();

        await alunoModel.create(pedido.aluno);
      } else {
        delete pedido.aluno.senha;
        await alunoModel.update(pedido.aluno, {
          where: {
            cpf: pedido.aluno.cpf,
          },
        });
      }

      if (!isKit) {
        for (p of pedido.carrinho.listas) {
          nome_lista = {
            id_item: 0,
            id_lista_item: 0,
            descri_item: p.nome_exibi_lista.toUpperCase(),
            qtd_item: 0,
            obs_item: "",
            disponivel_item: "0",
            opcional_item: "0",
            outros_item: "1",
            kit_item: "0",
            ordem_item: 0,
            trava_qtd_item: 0,
            marcas: [
              {
                id_marca: 0,
                id_item_marca: 0,
                cod_marca: "0",
                nome_marca: "0",
                valor_marca: "0",
              },
            ],
            selected: false,
            selectedMarca: {
              id_marca: 0,
              id_item_marca: 0,
              cod_marca: "0",
              nome_marca: "0",
              valor_marca: "0",
            },
          };
          p.items.unshift(nome_lista);
          itemsPedido = itemsPedido.concat(p.items);

          for (i of itemsPedido) {
            i.qtd_item = parseInt(i.qtd_item);
            i.total =
              parseInt(i.qtd_item) *
              parseFloat(
                i.selectedMarca.valor_marca == null
                  ? 0
                  : i.selectedMarca.valor_marca
              );
          }
          var totalPedido = itemsPedido.reduce(
            (sum, { total }) => sum + total,
            0
          );
          totalPedido = parseFloat(new Decimal(totalPedido).toFixed(2));

          var qtdPedido = itemsPedido.reduce(
            (sum, { qtd_item }) => sum + qtd_item,
            0
          );
        }
        let brindes = await brindeModel.ListasBrinde.findAll({
          where: {
            status: true,
            id_semestre: semestre.id_semestre,
            valor: {
              [brindeModel.db.Sequelize.Op.lt]: parseFloat(totalPedido),
            },
          },
          include: {
            model: brindeModel.Brindes,
            as: "item",
            raw: true,
          },
          order: [["valor", "ASC"]],
        });

        if (brindes.length > 0) {
          if (!brindes[0].acumula) {
            // po tu é foda, resolveu o brinde amigo
            brindes = brindes.reduce(function (prev, curr) {
              return prev.valor > curr.valor ? prev : curr;
            });
            itemsPedido.unshift({
              id_item: 0,
              id_lista_item: 0,
              descri_item: brindes.item.descricao_site.toUpperCase(),
              qtd_item: 1,
              obs_item: "BRINDE",
              disponivel_item: "0",
              opcional_item: "0",
              outros_item: "0",
              kit_item: "0",
              ordem_item: 0,
              trava_qtd_item: 0,
              selected: true,
              selectedMarca: {
                id_marca: 0,
                id_item_marca: 0,
                cod_marca: brindes.codigo,
                nome_marca: brindes.item.descricao_site.toUpperCase(),
                valor_marca: 0.01,
              },
            });
          } else {
            for (let brinde = brindes.length - 1; brinde >= 0; brinde--) {
              itemsPedido.unshift({
                id_item: 0,
                id_lista_item: 0,
                descri_item: brindes[brinde].item.descricao_site.toUpperCase(),
                qtd_item: 1,
                obs_item: "BRINDE",
                disponivel_item: "0",
                opcional_item: "0",
                outros_item: "0",
                kit_item: "0",
                ordem_item: 0,
                trava_qtd_item: 0,
                selected: true,
                selectedMarca: {
                  id_marca: 0,
                  id_item_marca: 0,
                  cod_marca: brindes[brinde].codigo,
                  nome_marca: brindes[brinde].item.descricao_site.toUpperCase(),
                  valor_marca: 0.01,
                },
              });
            }
          }

          itemsPedido.unshift({
            id_item: 0,
            id_lista_item: 0,
            descri_item: "BRINDES",
            qtd_item: 0,
            obs_item: "",
            disponivel_item: "0",
            opcional_item: "0",
            outros_item: "1",
            kit_item: "0",
            ordem_item: 0,
            trava_qtd_item: 0,
            marcas: [
              {
                id_marca: 0,
                id_item_marca: 0,
                cod_marca: "0",
                nome_marca: "0",
                valor_marca: "0",
              },
            ],
            selected: false,
            selectedMarca: {
              id_marca: 0,
              id_item_marca: 0,
              cod_marca: "0",
              nome_marca: "0",
              valor_marca: "0",
            },
          });
        }
      } else {
        var qtdPedido = 0;
        var totalPedido = parseFloat(pedido.carrinho.kit.total_kit);
        for (item of pedido.carrinho.kit.kit_academico_items) {
          itemsPedido.push(item);
          qtdPedido++;
        }
      }
      let novoPedido = {
        cpf_aluno: pedido.aluno.cpf.replace(/\D/g, ""),
        data_pedido: moment.nowDBNoTime(),
        hora_pedido: moment.nowTime(),
        emitido: false,
        status: "VALIDO",
        status_aluno: "AGUARDANDO PAGAMENTO",
        comentario: "",
        grupo: pedido.aluno.grupo,
        faculdade: pedido.aluno.faculdade,
        semestre: pedido.aluno.semestre,
        periodo: pedido.aluno.periodo,
        contato: pedido.aluno.contato,
        valor_total: totalPedido,
        itens_total: qtdPedido,
        valor_faturado: "0",
        acrescimo: "0",
        faturado_em: null,
        removido: false,
        vendedor: pedido.aluno.vendedor,
        pagamento_online: semestre.venda_semestre,
        rastreio: false,
        temporario: true,
        reserva: semestre.reserva_semestre,
        entregue: false,
        entregue_em: null,
        entregue_por: null,
        pontos_inseridos: "0",
        id_kit: isKit ? pedido.carrinho.kit.id_kit : "0",
      };
      if (pedidoNaoPago !== null) {
        //se houver um pedido não pago, ele sera deletado e seu id sera usado
        //para este novo pedido
        novoPedido.id_pedidos = pedidoNaoPago.dataValues.id_pedidos;
        if (pedidoNaoPago.pagamentos_pix) {
          await CancelarPix(pedidoNaoPago.pagamentos_pix.txid);
        }
        await pedidoModel.destroy({
          where: {
            id_pedidos: pedidoNaoPago.dataValues.id_pedidos,
          },
        });
        novoPedido.novo_pedido = false;
      }

      var retornoPedido = await pedidoModel.create(novoPedido);

      if (!isKit) {
        for (i of itemsPedido) {
          if (i.selected || i.outros_item === "1") {
            delete i.id_item;
            i.id_item_pedido = retornoPedido.dataValues.id_pedidos;
            i.produto_millennium = null;
            i.qtd_item = i.qtd_item;
            i.descri_item = i.descri_item;
            if (i.outros_item === "1") {
              i.cod_item = "0";
              i.valor_item = "0";
              i.marca_item = "0";
            } else {
              i.cod_item = i.selectedMarca.cod_marca;
              i.valor_item = i.selectedMarca.valor_marca;
              i.marca_item = i.selectedMarca.nome_marca;
            }
            await itemPedidoModel.create(i);
          }
        }
      } else {
        for (item of itemsPedido) {
          item = {
            id_item_pedido: retornoPedido.dataValues.id_pedidos,
            cod_item: item.codigo,
            produto_millennium: null,
            qtd_item: item.qtd,
            valor_item: item.valor,
            descri_item: item.descricao,
            marca_item: null,
          };
          await itemPedidoModel.create(item);
        }
      }

      let pagamento = {
        id_pedido: retornoPedido.dataValues.id_pedidos,
        status_pagamento: "NÃO PAGO",
      };
      await pagamentosModel.Pagamentos.create(pagamento);

      if (
        retornoPedido.dataValues.novo_pedido == 1 ||
        retornoPedido.dataValues.id_pedidos == true
      ) {
        try {
          email.sendEmailPedido({
            email: emailAluno,
            nome: nomeAluno,
            sobrenome: sobrenomeAluno,
            id_pedidos: retornoPedido.dataValues.id_pedidos,
          });
        } catch (error) {
          console.log(error);
        }
      }

      let estrangeiro = {
        is:
          pedido.aluno.estrangeiro == undefined
            ? false
            : pedido.aluno.estrangeiro,
        cpf: pedido.aluno.cpf,
      };
      if (pedido.aluno.estrangeiro) {
        await estrangeiroModel.create({
          cpf: pedido.aluno.cpf,
          nome:
            pedido.aluno.nome.trim().toUpperCase() +
            " " +
            pedido.aluno.sobrenome.trim().toUpperCase(),
          pedido: retornoPedido.dataValues.id_pedidos.toString(),
        });
      }
      res.send(
        crypto.encrypt(
          {
            id_pedido: retornoPedido.dataValues.id_pedidos.toString(),
            estrangeiro: estrangeiro,
          },
          true
        )
      );
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };

  this.salvar_outros = async function (res, req) {
    try {
      let dados = crypto.decrypt(req.body.data, true);

      //remover saldo manual
      let itensSaldo =
        await item_controlar_saldoModel.item_controlar_saldo.findAll({
          raw: true,
        });
      let itensPedido = await itemPedidoModel.findAll({
        where: {
          id_item_pedido: dados.pedido,
        },
        raw: true,
      });

      for (let item of itensPedido) {
        if (itensSaldo.length <= 0) break;
        for (let i = 0; i < itensSaldo.length; i++) {
          if (item.cod_item == itensSaldo[i].codigo && itensSaldo[i].status) {
            await item_controlar_saldoModel.item_controlar_saida.create({
              codigo: item.cod_item,
              qtd: item.qtd_item,
              usuario: "SITE",
              data: moment.nowDB(),
            });
            await item_controlar_saldoModel.item_controlar_saldo.update(
              { saldo: itensSaldo[i].saldo - parseInt(item.qtd_item) },
              {
                where: {
                  id: itensSaldo[i].id,
                },
              }
            );
            itensSaldo.splice(i, 1);
            break;
          }
        }
      }
      //remover saldo manual

      await pedidoModel.update(
        {
          valor_frete: dados.frete,
          reserva: 0,
          temporario: 0,
        },
        {
          where: {
            id_pedidos: dados.pedido,
          },
        }
      );

      await pagamentosModel.Pagamentos.update(
        {
          tipo_pagamento: "OUTROS",
        },
        {
          where: {
            id_pedido: dados.pedido,
          },
        }
      );
      let retorno = {
        id_pedido: dados.pedido,
        total: dados.total,
        outros: true,
      };
      res.send(crypto.encrypt(retorno, true));
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };

  this.getPedido = async function (res, req) {
    try {
      let id = crypto.decrypt(req.query.data, true);

      let pedido = await pedidoModel.findOne({
        include: [
          //{ model: itemPedidoModel },
          { model: pagamentosModel.Pagamentos },
          { model: pagamentosModel.Boleto },
          { model: pagamentosModel.Credito },
          { model: pagamentosModel.Pix },
        ],
        where: {
          id_pedidos: id,
          removido: 0,
        },
      });

      res.send(crypto.encrypt(pedido, true));
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };

  this.getPedidos = async function (res, req) {
    try {
      let cpf = crypto.decrypt(req.query.data, true);

      let pedidos = await pedidoModel.findAll({
        include: [
          { model: itemPedidoModel },
          { model: pagamentosModel.Pagamentos },
          { model: pagamentosModel.Boleto },
          { model: pagamentosModel.Credito },
          { model: pagamentosModel.Pix },
        ],
        where: {
          cpf_aluno: cpf,
          removido: 0,
        },
        order: [["id_pedidos", "DESC"]],
      });

      let dataAtual = new Date();
      dataAtual = new Date(dataAtual.toString().substring(0, 9));

      for (let pedido of pedidos) {
        if (
          pedido.pagamentos_boleto != null &&
          pedido.status_aluno != "CANCELADO" &&
          pedido.pagamentos_boleto.status != "PAGO"
        ) {
          let diff = moment.compare(
            new Date(),
            pedido.pagamentos_boleto.expiration_date
          );

          if (diff > 9) {
            pedido.pagamentos_boleto.status = "VENCIDO";
            pedido.status_aluno = "CANCELADO";
            await pedidoModel.update(
              { status_aluno: "CANCELADO", removido: 1 },
              {
                where: {
                  id_pedidos: pedido.id_pedidos,
                },
              }
            );
          } else {
            // mostra vencimento
            let dataFormatada = moment.format(
              pedido.pagamentos_boleto.expiration_date
            );
            pedido.dataValues.pagamentos_boleto.dataValues.expiration_date =
              dataFormatada;
          }
        }

        //Todo: pedidos cobrança outros ainda n tem tabela de pagamento, atualizar isso quando tiverem
        if (
          pedido.cobranca_outros == 0 &&
          pedido.pagamento != null &&
          pedido.pagamento.tipo_pagamento == null
        ) {
          await PedidoListasModified(pedido);
          //Todo: updatar status aluno no banco
        }
        pedido.data_pedido = moment.format(pedido.data_pedido);
      }
      res.send(crypto.encrypt(pedidos, true));
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };

  this.getPedidoCheckout = async function (res, req) {
    try {
      let id_pedidos = crypto.decrypt(req.query.data, true);

      let pedido = await pedidoModel.findOne({
        include: [
          {
            model: semestreModel.semestres,
            as: "sem",
            include: {
              model: freteModel.Zonas,
              include: {
                model: freteModel.Sub_zonas,
                include: { model: freteModel.Setores },
              },
            },
          },
          { model: alunoModel },
          { model: descontoRepresentantesModel.desconto_representantes },
          { model: semestrePagamentoModel.semestre_pagamento },
          { model: semestrePagamentoModel.parcelas_pagamento_credito },
        ],
        where: {
          id_pedidos: id_pedidos,
          pagamento_online: 1,
          temporario: 1,
        },
        order: [
          [
            { model: semestrePagamentoModel.parcelas_pagamento_credito },
            "id",
            "asc",
          ],
          [
            { model: semestreModel.semestres, as: "sem" },
            "id_semestre",
            "desc",
          ],
          [
            { model: semestreModel.semestres, as: "sem" },
            { model: freteModel.Zonas },
            "id",
            "asc",
          ],
          [
            { model: semestreModel.semestres, as: "sem" },
            { model: freteModel.Zonas },
            { model: freteModel.Sub_zonas },
            "id",
            "asc",
          ],
          [
            { model: semestreModel.semestres, as: "sem" },
            { model: freteModel.Zonas },
            { model: freteModel.Sub_zonas },
            { model: freteModel.Setores },
            "id",
            "asc",
          ],
        ],
      });

      if (pedido == null) {
        res.send(
          crypto.encrypt(
            {
              pedido: { semestre_pagamento: { credito: true, boleto: true } },
              kitFormasPagamento: null,
            },
            true
          )
        );
      }

      let pedidos = await pedidoModel.findAll({
        include: [
          {
            model: pagamentosModel.Boleto,
          },
        ],
        where: {
          cpf_aluno: pedido.cpf_aluno,
        },
      });

      /**
       * Verificação para permitir boleto
       */
      pedido.dataValues.naoPodeBoleto = false;

      if (pedidos != null) {
        let count = 0;
        for (let pedido of pedidos) {
          if (pedido.pagamentos_boleto != null) {
            if (pedido.pagamentos_boleto.status_label != "PAGO") {
              count++;
            }
          }
        }
        if (count >= pedido.semestre_pagamento.max_boleto_por_cpf) {
          pedido.dataValues.naoPodeBoleto = true;
        }
      }

      /**
       * Verificação para permitir boleto
       */

      /**
       * GAMBIARRA DO PAULO
       */
      //caso não tenha desconto, desconto_representante sera nulo,
      //se tiver desconto, testa se esse
      //desconto é porcentagem ou não e retorna true ou false.
      if (pedido.dataValues.desconto_representante != null) {
        pedido.dataValues.desconto_representante.dataValues.porcentagem =
          !!pedido.dataValues.desconto_representante.desconto_porcentagem;
      }
      /**
       * GAMBIARRA DO PAULO
       */

      //pagamento kit
      let kitFormasPagamento = null;
      if (pedido.dataValues.id_kit != 0) {
        kitFormasPagamento =
          await kitAcademicoFormasPagamentoModel.kit_academico_formas_pagamento.findAll(
            {
              where: {
                id_kit: pedido.dataValues.id_kit,
              },
            }
          );
      }

      pedido.dataValues.listasModified = false;
      //verifica se as listas do semestre foram modificadas caso não seja um pedido de kit
      if (pedido.id_kit == 0 && (await PedidoListasModified(pedido))) {
        pedido.dataValues.listasModified = true;
      }

      res.send(
        crypto.encrypt(
          { pedido: pedido, kitFormasPagamento: kitFormasPagamento },
          true
        )
      );
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };

  this.getPedidoCheckoutItens = async function (res, req) {
    try {
      let id_pedidos = crypto.decrypt(req.query.data, true);
      let itens = await itemPedidoModel.findAll({
        where: {
          id_item_pedido: id_pedidos,
        },
      });
      res.send(crypto.encrypt(itens, true));
    } catch (error) {
      console.log("getPedidoCheckoutItens: ", error);
      res.send(crypto.encrypt(false, true));
    }
  };

  this.criarPix = async function (res, req) {
    try {
      let data = crypto.decrypt(req.body.data, true);
      let pagamentoPix = await pagamentosModel.Pix.findOne({
        where: {
          id_pedido: data.id_pedido,
        },
      });
      if (pagamentoPix) {
        if (pagamentoPix.status == "CONCLUIDA") {
          res.send({ pixJaPago: true });
          return;
        } else {
          let retornoCancelarPix = await CancelarPix(
            pagamentoPix.txid,
            data.banco
          );
          if (retornoCancelarPix.chave) {
            pagamentosModel.Pix.destroy({
              where: {
                id_pedido: data.id_pedido,
              },
            });
          }
        }
      }

      await pedidoModel.update(
        { valor_frete: data.frete },
        {
          where: {
            id_pedidos: data.id_pedido,
          },
        }
      );

      let retornoPix = await axios.post("https://solident.com.br/node/pix", {
        dados: {
          id_pedido: data.id_pedido,
          banco: data.banco,
          devedor: {
            cpf: data.cpf.replace(/\D/g, ""),
            nome: data.nome,
          },
          valor: {
            original: data.valor.toFixed(2).toString(),
          },
          codigo_link: data.id_pedido + "-Site",
          calendario: {
            expiracao: "300", //tempo em segundos
          },
        },
      });

      console.log("oba", retornoPix);

      await pagamentosModel.Pix.create({
        desconto: data.descontoUsado,
        desconto_valor: data.descontoValor,
        id_pedido: data.id_pedido,
        criado_em: moment.nowDB(),
        expira_em: moment.addDaysToDate(moment.nowDB(), 1),
        status: retornoPix.data.status,
        revisao: retornoPix.data.revisao,
        qrcode:
          data.banco == "C6"
            ? retornoPix.data.pixCopiaECola
            : retornoPix.data.textoImagemQRcode,
        txid: retornoPix.data.txid,
        valor: retornoPix.data.valor.original,
        chave: retornoPix.data.chave,
        obs: retornoPix.data.solicitacaoPagador,
        banco: data.banco,
      });

      axios.post(process.env.URL_SERVIDOR_PAGAMENTO + "/retorno/pix_manual", {
        dados: {
          txid: retornoPix.data.txid,
          banco: data.banco,
        },
      });

      res.send(retornoPix.data);
    } catch (error) {
      console.log(error);
      res.send(false);
    }
  };

  this.checarPedido = async function (res, req) {
    let dados = crypto.decrypt(req.body.data, true);
    let id_pedido = dados.id_pedido;
    let pedido = await pedidoModel.findOne({
      where: {
        id_pedidos: id_pedido,
      },
    });

    let horaCliente = dados.dataPedido.hora.split(":");
    let dataCliente = dados.dataPedido.data.split("-");

    let dataPedidoCliente = new Date(
      dataCliente[0],
      parseInt(dataCliente[1]) - 1,
      dataCliente[2],
      horaCliente[0],
      horaCliente[1],
      horaCliente[2]
    );
    // console.log("cliente: ", horaCliente, dataCliente, dataPedidoCliente);

    let horaBase = pedido.dataValues.hora_pedido.split(":");
    let dataBase = pedido.dataValues.data_pedido.split("-");
    let dataPedidoBase = new Date(
      dataBase[0],
      parseInt(dataBase[1]) - 1,
      dataBase[2],
      horaBase[0],
      horaBase[1],
      horaBase[2]
    );
    // console.log("base: ", horaBase, dataBase, dataPedidoBase);

    if (
      dataPedidoBase.toString() != dataPedidoCliente.toString() ||
      (await PedidoListasModified(pedido))
    ) {
      res.send(crypto.encrypt({ valido: false }, true));
    } else {
      let itensSaldo =
        await item_controlar_saldoModel.item_controlar_saldo.findAll({
          raw: true,
        });
      let itensPedido = await itemPedidoModel.findAll({
        where: {
          id_item_pedido: id_pedido,
        },
        raw: true,
      });

      // console.log("itensSaldo: ", itensSaldo);
      // console.log("itensPedido: ", itensPedido);

      let itensEmFalta = [];
      for (let itemPedido of itensPedido) {
        if (itensSaldo.length <= 0) break;
        for (let i = 0; i < itensSaldo.length; i++) {
          if (
            itemPedido.cod_item == itensSaldo[i].codigo &&
            itensSaldo[i].status
          ) {
            itemPedido.qtd_disponivel = itensSaldo[i].saldo;
            if (itemPedido.qtd_item > itensSaldo[i].saldo) {
              itensEmFalta.push(itemPedido);
            }
            itensSaldo.splice(i, 0);
            break;
          }
        }
      }

      // console.log("itens para remover: ", itensEmFalta);
      if (itensEmFalta.length > 0) {
        for (let item of itensEmFalta) {
          if (item.qtd_disponivel <= 0) {
            await itemPedidoModel.destroy({
              where: {
                id_item_pedido: id_pedido,
                cod_item: item.cod_item,
              },
            });
          } else {
            await itemPedidoModel.update(
              { qtd_item: item.qtd_disponivel },
              {
                where: {
                  id_item_pedido: id_pedido,
                  cod_item: item.cod_item,
                },
              }
            );
          }
        }
        itensPedido = await itemPedidoModel.findAll({
          where: {
            id_item_pedido: id_pedido,
            cod_item: {
              [semestreModel.sequelize.Op.ne]: "0",
            },
          },
          raw: true,
        });
        if (itensPedido.length <= 0) {
          await pedidoModel.destroy({
            where: {
              id_pedidos: id_pedido,
            },
          });
          res.send(
            crypto.encrypt({ valido: true, pedidoCanceladoSaldo: true }, true)
          );
          return;
        }

        for (i of itensPedido) {
          i.qtd_item = parseInt(i.qtd_item);
          i.total = parseInt(i.qtd_item) * parseFloat(i.valor_item);
        }
        let totalPedido = itensPedido.reduce(
          (sum, { total }) => sum + total,
          0
        );
        totalPedido = parseFloat(new Decimal(totalPedido).toFixed(2));

        let qtdPedido = itensPedido.reduce(
          (sum, { qtd_item }) => sum + qtd_item,
          0
        );

        await pedidoModel.update(
          { valor_total: totalPedido, itens_total: qtdPedido },
          {
            where: {
              id_pedidos: id_pedido,
            },
          }
        );
        res.send(crypto.encrypt({ valido: true, itensEmFalta }, true));
        return;
      }
      res.send(crypto.encrypt({ valido: true }, true));
    }
  };

  this.sendEmailPagamentoSucesso = async function (res, req) {
    try {
      let data = crypto.decrypt(req.body.data, true);

      if (data.pedido.outros) {
        email.sendPagamentoSucesso({
          outros: true,
          email: data.aluno.email,
          nome: data.aluno.nome + " " + data.aluno.sobrenome,
          valor: data.pedido.valor.toFixed(2).replace(".", ","),
          id_pedidos: data.pedido.id_pedidos,
        });
      } else {
        email.sendPagamentoSucesso({
          outros: false,
          email: data.aluno.email,
          nome: data.aluno.nome + " " + data.aluno.sobrenome,
          valor: data.pedido.valor.toFixed(2).replace(".", ","),
          ReservadoOuCobrado: data.pedido.reservado ? "reservado" : "cobrado",
          boleto: data.pedido.boleto,
          id_pedidos: data.pedido.id_pedidos,
          link: data.pedido.link,
        });
      }

      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };

  this.updateListasVendidas = async function (res, req) {
    try {
      let id_pedido = crypto.decrypt(req.body.data, true);

      let pedido = await pedidoModel.findOne({
        where: {
          id_pedidos: id_pedido,
        },
      });

      let semestre = await semestreModel.semestres.findOne({
        where: {
          id_semestre: pedido.dataValues.semestre,
        },
      });

      await semestreModel.semestres.update(
        {
          listas_vendidas: ++semestre.dataValues.listas_vendidas,
        },
        {
          where: {
            id_semestre: pedido.dataValues.semestre,
            limite_venda: {
              [semestreModel.sequelize.Op.ne]: -1,
            },
          },
        }
      );

      res.send(crypto.encrypt(true, true));
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };

  this.updateDescontoRepresentante = async function (res, req) {
    try {
      let cpf_aluno = crypto.decrypt(req.body.data, true);

      await descontoRepresentantesModel.desconto_representantes.update(
        {
          valido: 0,
        },
        {
          where: {
            cpf_aluno: cpf_aluno.replace(/\D/g, ""),
          },
        }
      );
      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };

  this.updatePedidoDesconto = async function (res, req) {
    try {
      let data = crypto.decrypt(req.body.data, true);

      await pedidoModel.update(
        {
          desconto_representantes: 1,
          valor_desconto: data.desconto_representante,
        },
        {
          where: {
            id_pedidos: data.id_pedido,
          },
        }
      );
      res.status(200).send(crypto.encrypt(true, true));
    } catch (error) {
      console.log(error);
      res.status(500).send(crypto.encrypt(false, true));
    }
  };

  async function PedidoListasModified(pedido) {
    let listas = await listaModel.listas.findAll({
      where: {
        id_semestre_lista: pedido.semestre,
        situacao_lista: 1,
      },
    });

    let dataSplit = pedido.data_pedido.split("-");
    let horaSplit = pedido.hora_pedido.split(":");
    let Datepedido = new Date(
      dataSplit[0],
      dataSplit[1] - 1,
      dataSplit[2],
      horaSplit[0],
      horaSplit[1],
      horaSplit[2]
    );

    for (lista of listas) {
      // compara a data do pedido com a data de criação da lista, caso a a data de modificação esteja nula
      if (
        Datepedido <
        (lista.date_modify == null ? lista.date_create : lista.date_modify)
      ) {
        pedido.status_aluno = "CANCELADO";
        return true;
      }
    }
    return false;
  }

  async function CancelarPix(txid, banco) {
    let retornoPixAlterar = await axios.post(
      process.env.URL_SERVIDOR_PAGAMENTO + "/pix_alterar",
      {
        dados: {
          txid: txid,
          banco: banco,
        },
      }
    );
    return retornoPixAlterar.data;
  }

  return this;
};

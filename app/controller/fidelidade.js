module.exports = (app) => {
    const crypto = app.utils.crypto;
    const moment = app.utils.moment;
    const email = app.utils.email;

    const fidelidadeModel = app.orm_model.fidelidade;
    const alunoModel = app.orm_model.aluno

    this.getFidelidade = async function (req, res) {
        try {

            let cpf = crypto.decrypt(req.query.data, true);

            let produtos = await fidelidadeModel.produto_fidelidade.findAll({
                where: {
                    status: 1
                },
            });

            let resgates = await fidelidadeModel.aluno_resgates.findAll({
                where: {
                    cpf_aluno: cpf
                },
                order: [["id", "DESC"]],
            });

            for (resgate of resgates) {
                resgate.dataValues.create_at = moment.format(resgate.dataValues.create_at);
            }

            let extratos = await fidelidadeModel.aluno_pontos_inseridos.findAll({
                where: {
                    cpf: cpf,
                    expirado: 0
                }
            })

            for (extrato of extratos) {
                extrato.dataValues.validade = moment.format(extrato.dataValues.inserido_em.setFullYear(extrato.dataValues.inserido_em.getFullYear() + 1));
            }

            res.send(crypto.encrypt({ produtos: produtos, resgates: resgates, extratos: extratos }, true))
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    }
    this.getResgate = async function (req, res) {
        try {

            let id_resgate = crypto.decrypt(req.query.data, true);

            let resgateRetorno = await fidelidadeModel.aluno_resgates.findOne({
                where: {
                    id: id_resgate
                },
            });

            let expirationDate = new Date(resgateRetorno.dataValues.create_at)
            resgateRetorno.dataValues.create_at = moment.format(resgateRetorno.dataValues.create_at);
            resgateRetorno.dataValues.expirationDate = moment.format(expirationDate.setMonth(expirationDate.getMonth() + 3))

            res.send(crypto.encrypt({ resgate: resgateRetorno, pontos: null }, true))
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    }

    this.salvarResgate = async function (req, res) {
        try {
            let data = crypto.decrypt(req.body.data, true)

            let resgate = {
                codigo_produto: data.produto.codigo,
                cpf_aluno: data.cpf,
                create_at: moment.nowDB(),
                excluido: 0,
                id_produto: data.produto.id,
                nome_produto: data.produto.nome,
                pontos_produto: data.produto.pontos,
                status: 0,
                tipo_resgate: "produto",
                valor_produto: data.produto.pontos,
            }

            let aluno = await alunoModel.findOne({
                where: {
                    cpf: data.cpf
                }
            })

            if (aluno.dataValues.pontos >= resgate.pontos_produto) {
                aluno.dataValues.pontos -= resgate.pontos_produto
                let resgateRetorno = await fidelidadeModel.aluno_resgates.create(resgate);
                if (resgateRetorno.id) {
                    let expirationDate = new Date(resgateRetorno.dataValues.create_at)
                    resgateRetorno.dataValues.create_at = moment.format(resgateRetorno.dataValues.create_at);
                    resgateRetorno.dataValues.expirationDate = moment.format(expirationDate.setMonth(expirationDate.getMonth() + 3))
                    await alunoModel.update({ pontos: aluno.dataValues.pontos }, {
                        where: {
                            cpf: aluno.dataValues.cpf
                        }
                    })

                    email.sendEmailResgate(aluno, resgateRetorno)

                    res.send(crypto.encrypt({ resgate: resgateRetorno, pontos: aluno.dataValues.pontos }, true))
                } else {
                    res.status(500).send();
                }
            } else {
                res.send(crypto.encrypt({ resgate: null, pontos: false }, true))
            }
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    }

    this.sendEmailFidelidadeContato = async function (res, req) {
        try {

            let posVenda = crypto.decrypt(req.body.data, true)
            retorno = await email.sendEmailFidelidadeContato(posVenda)

            res.send(crypto.encrypt(retorno, true))
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }

    }

    return this;
}
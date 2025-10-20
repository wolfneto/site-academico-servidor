module.exports = (app) => {

    var nodeMailer = require("nodemailer");

    var transporter = nodeMailer.createTransport({
        host: 'mail.academicosolident.com.br',
        port: 465,
        secure: true,
        debug: true,
        auth: {
            user: 'admin@academicosolident.com.br',
            pass: '}$~JcZH.v,I+'
        }
    });

    var transporterAux = nodeMailer.createTransport({
        host: 'smtp.kinghost.net',
        port: 465,
        secure: true,
        debug: true,
        auth: {
            user: 'dentalsolident@dentalsolident.com.br',
            pass: 'Sol!15King'
        }
    });

    const Email = require('email-templates');

    const email = new Email({
        transport: transporterAux,
        send: true,
        preview: false,
        views: {
            options: {
                extension: 'ejs',
            },
            root: 'app/template',
        },
    });

    this.sendEmailPedido = async function(pedido) {
        let retorno = await email.send({
            template: 'pedido',
            message: {
                from: '"Acadêmico Solident" <dentalsolident@dentalsolident.com.br>',
                to: pedido.email,
            },
            locals: {
                nome: pedido.nome + ' ' + pedido.sobrenome,
                pedido: pedido.id_pedidos,
                link: process.env.BASE_URL + '/checkout/seus-dados/' + pedido.id_pedidos
            },
        });

        return retorno;
    }

    this.sendPagamentoSucesso = async function(pedido) {
        if (pedido.outros) {
            await email.send({
                template: 'outrosEnviado',
                message: {
                    from: '"Acadêmico Solident" <dentalsolident@dentalsolident.com.br>',
                    to: pedido.email,
                },
                locals: {
                    nome: pedido.nome,
                    valor: pedido.valor,
                    pedido: pedido.id_pedidos,
                },
            });
        } else {
            await email.send({
                template: pedido.boleto ? 'boletoGerado' : 'pagamentoSucesso',
                message: {
                    from: '"Acadêmico Solident" <dentalsolident@dentalsolident.com.br>',
                    to: pedido.email,
                },
                locals: {
                    nome: pedido.nome,
                    valor: pedido.valor,
                    ReservadoOuCobrado: pedido.ReservadoOuCobrado,
                    pedido: pedido.id_pedidos,
                    link: pedido.link
                },
            });
        }
    }

    this.sendEmailPosVenda = async function(posVenda) {
        let retorno = await email.send({
            template: 'posVenda',
            message: {
                from: '"Acadêmico Solident" <dentalsolident@dentalsolident.com.br>',
                to: 'contato@academicosolident.com.br',
            },
            locals: {
                faculdade: posVenda.aluno.Faculdade.nome_exibicao_faculdade,
                nomeAluno: posVenda.aluno.nome + ' ' + posVenda.aluno.sobrenome,
                semestre: posVenda.aluno.Semestre.descri_semestre,
                periodo: posVenda.aluno.Periodo.nome_periodo,
                contato: posVenda.aluno.Representante.nome_representante,
                cpf: posVenda.aluno.cpf,
                email: posVenda.aluno.email,
                celular: posVenda.aluno.celular,
                telefone: posVenda.aluno.telefone,
                pedido: posVenda.pedido,
                motivo: posVenda.motivo,
                mensagem: posVenda.mensagem

            },
        });
        return retorno;
    }

    this.sendEmailSenha = async function(obj) {
        let aluno = obj.aluno

        let hash = obj.hash

        let retorno = await email.send({
            template: 'senha',
            message: {
                from: '"Acadêmico Solident" <dentalsolident@dentalsolident.com.br>',
                to: aluno.email
            },
            locals: {
                nome: aluno.nome + ' ' + aluno.sobrenome,
                link: process.env.BASE_URL + '/trocar-senha/' + hash
            },
        });

        return retorno;
    }

    this.sendEmailFidelidadeContato = async function(fidelidade) {
        let retorno = await email.send({
            template: 'fidelidadeContato',
            message: {
                from: '"Acadêmico Solident" <dentalsolident@dentalsolident.com.br>',
                to: 'fidelidade@academicosolident.com.br',
            },
            locals: {
                faculdade: fidelidade.aluno.Faculdade.nome_exibicao_faculdade,
                nomeAluno: fidelidade.aluno.nome + ' ' + fidelidade.aluno.sobrenome,
                semestre: fidelidade.aluno.Semestre.descri_semestre,
                periodo: fidelidade.aluno.Periodo.nome_periodo,
                contato: fidelidade.aluno.Representante.nome_representante,
                cpf: fidelidade.aluno.cpf,
                email: fidelidade.aluno.email,
                celular: fidelidade.aluno.celular,
                telefone: fidelidade.aluno.telefone,
                mensagem: fidelidade.mensagem
            },
        });
        return retorno;
    }

    this.sendEmailResgate = async function(aluno, resgateRetorno) {
        let resgate = resgateRetorno.dataValues

        let retorno = await email.send({
            template: 'resgate',
            message: {
                from: '"Acadêmico Solident" <dentalsolident@dentalsolident.com.br>',
                to: aluno.email,
            },
            locals: {
                validade: resgate.expirationDate,
                cliente: aluno.nome + ' ' + aluno.sobrenome,
                cpf: resgate.cpf_aluno,
                codigoResgate: resgate.id,
                dataResgate: resgate.create_at,
                pontosResgate: resgate.pontos_produto,
                nomeProduto: resgate.nome_produto.toUpperCase(),
            },
        });
        return retorno;
    }

    return this;
}
module.exports = (app) => {
  const email = app.utils.email;
  const crypto = app.utils.crypto;
  const moment = app.utils.moment;

  const AlunoModel = app.orm_model.aluno;
  const AlunoEnderecoModel = app.orm_model.aluno_endereco;
  const alunoSessionModel = app.orm_model.aluno_session;
  const AlteracaoSenhaAlunoModel = app.orm_model.alteracao_senha_aluno;

  const FaculdadeModel = app.orm_model.faculdade;
  const PeriodoModel = app.orm_model.periodo;
  const RepresentanteModel = app.orm_model.representante;
  const SemestreModel = app.orm_model.semestre;

  AlunoModel.hasOne(FaculdadeModel.faculdades, {
    foreignKey: "id_faculdade",
    sourceKey: "faculdade",
    as: "Faculdade",
  });
  AlunoModel.hasOne(SemestreModel.semestres, {
    foreignKey: "id_semestre",
    sourceKey: "semestre",
    as: "Semestre",
  });
  AlunoModel.hasOne(PeriodoModel.periodos, {
    foreignKey: "id_periodo",
    sourceKey: "periodo",
    as: "Periodo",
  });
  AlunoModel.hasOne(RepresentanteModel.representantes, {
    foreignKey: "id_representante",
    sourceKey: "contato",
    as: "Representante",
  });

  // this.hashtudo = async function(res, req) {
  //     try {
  //         let alunos = await AlunoModel.findAll({
  //             raw: true
  //         });

  //         for (let aluno of alunos) {

  //             const hash = await crypto.Bcrypt.hashSync(aluno.senha.trim(), crypto.Salt);
  //             aluno.senha = hash;
  //             await AlunoModel.update({ senha: aluno.senha }, {
  //                 where: {
  //                     cpf: aluno.cpf
  //                 }
  //             })

  //         }
  //         res.send(true);
  //     } catch (error) {
  //         console.log('oporra', error);
  //         res.send(false);
  //     }
  // }

  this.getUsuario = async function (req, res) {
    try {
      let cpf = req.session.passport.user;

      let usuario = await AlunoModel.findOne({
        where: {
          cpf: cpf,
        },
        include: [
          { model: FaculdadeModel.faculdades, as: "Faculdade" },
          { model: SemestreModel.semestres, as: "Semestre" },
          { model: PeriodoModel.periodos, as: "Periodo" },
          { model: RepresentanteModel.representantes, as: "Representante" },
        ],
        raw: true,
        nest: true,
      });
      let session = await alunoSessionModel.aluno_session.findOne({
        where: {
          cpf_aluno: cpf,
        },
        raw: true,
      });
      if (session != null) {
        session = crypto.decrypt(session.session, true);
        Object.assign(session.aluno, usuario);
      }

      usuario.session = session;

      res.status(200).send(crypto.encrypt(usuario, true));
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };

  this.salvarEnderecoEntrega = async function (req, res) {
    try {
      let data = crypto.decrypt(req.body.data, true);
      data.cpf_aluno = data.cpf_aluno.replace(/\D/g, "");

      let endereco = await AlunoEnderecoModel.findOne({
        where: {
          cpf_aluno: data.cpf_aluno,
        },
      });

      if (endereco) {
        await AlunoEnderecoModel.update(data, {
          where: {
            cpf_aluno: data.cpf_aluno,
          },
        });
      } else {
        await AlunoEnderecoModel.create(data);
      }
      res.status(200).send();
    } catch (error) {
      res.status(500).send();
    }
  };

  this.upsertSession = async function (req, res) {
    try {
      let session = crypto.decrypt(req.body.data, true);

      let alunoSession = {
        session: req.body.data,
        cpf_aluno: session.aluno.cpf,
      };

      let updateSession = await alunoSessionModel.aluno_session.findOne({
        where: {
          cpf_aluno: alunoSession.cpf_aluno,
        },
      });

      if (updateSession) {
        await alunoSessionModel.aluno_session.update(alunoSession, {
          where: {
            cpf_aluno: alunoSession.cpf_aluno,
          },
        });
      } else {
        await alunoSessionModel.aluno_session.create(alunoSession);
      }

      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };
  this.getTrocarSenha = async function (req, res) {
    try {
      let hash = req.query.data;

      if (hash.includes("-")) {
        hash = hash.replace(/-/g, "/");
      }

      let trocarSenha =
        await AlteracaoSenhaAlunoModel.alteracao_senha_aluno.findOne({
          where: {
            hash: hash,
          },
        });

      if (trocarSenha == null) {
        res.send(crypto.encrypt({ id: null }, true));
      } else {
        AlteracaoSenhaAlunoModel.alteracao_senha_aluno.update(
          {
            status: "0",
          },
          {
            where: {
              id: trocarSenha.id,
            },
          }
        );
        res.send(crypto.encrypt(trocarSenha, true));
      }
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };
  this.updateTrocarSenha = async function (res, req) {
    try {
      let data = crypto.decrypt(req.body.data, true);

      let senhaNovaHash = await crypto.Bcrypt.hashSync(
        data.senhaNova,
        crypto.Salt
      );
      await AlunoModel.update(
        { senha: senhaNovaHash },
        {
          where: {
            cpf: data.cpf,
          },
        }
      );
      res.status(200).send(true);
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };

  this.update = async function (res, req) {
    try {
      let aluno = crypto.decrypt(req.body.data, true);

      aluno.cpf = aluno.cpf.replace(/\D/g, "");

      aluno.email = aluno.email.toUpperCase();
      aluno.endereco = aluno.endereco.toUpperCase();
      aluno.complemento = aluno.complemento.toUpperCase();
      aluno.bairro = aluno.bairro.toUpperCase();

      aluno.celular = aluno.celular.replace(/\D/g, "");
      aluno.telefone = aluno.telefone.replace(/\D/g, "");
      aluno.cep = aluno.cep.replace(/-| /g, "");
      aluno.numero = aluno.numero.replace(/-| /g, "");

      aluno.updated_at = moment.nowDB();

      let retorno = await AlunoModel.update(aluno, {
        where: {
          cpf: aluno.cpf,
        },
      });
      if (retorno[0]) {
        res.send(crypto.encrypt(aluno, true));
      } else {
        res.send(crypto.encrypt(false, true));
      }
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };
  this.updateSenha = async function (res, req) {
    try {
      let data = crypto.decrypt(req.body.data, true);

      let aluno = await AlunoModel.findOne({
        where: {
          cpf: data.cpf,
        },
      });

      let result = await crypto.Bcrypt.compareSync(
        data.senhaAtual,
        aluno.senha
      );

      if (result) {
        let senhaNovaHash = await crypto.Bcrypt.hashSync(
          data.senhaNova,
          crypto.Salt
        );
        await AlunoModel.update(
          { senha: senhaNovaHash },
          {
            where: {
              cpf: data.cpf,
            },
          }
        );
        res.status(200).send(true);
      } else {
        res.status(200).send(false);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };
  this.updateEmail = async function (res, req) {
    try {
      let aluno = crypto.decrypt(req.body.data, true);
      console.log("oporra, aluno update email", aluno);
      let retorno = await AlunoModel.update(
        { email: aluno.email },
        {
          where: {
            cpf: aluno.cpf.replace(/\D/g, ""),
          },
        }
      );
      console.log(retorno);
      res.status(200).send(true);
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };

  this.checarCPF = async function (req, res) {
    try {
      let cpf = crypto.decrypt(req.query.data, true);

      console.log(cpf);

      let alunoJaExiste = await AlunoModel.findOne({
        where: {
          cpf: cpf.replace(/\D/g, ""),
        },
      });

      console.log(alunoJaExiste);

      alunoJaExiste
        ? res.send(crypto.encrypt(true, true))
        : res.send(crypto.encrypt(false, true));
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };

  this.sendEmailPosVenda = async function (res, req) {
    try {
      let posVenda = crypto.decrypt(req.body.data, true);
      retorno = await email.sendEmailPosVenda(posVenda);

      res.send(crypto.encrypt(retorno, true));
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };

  this.sendEmailSenha = async function (res, req) {
    try {
      let cpf = crypto.decrypt(req.body.data, true);
      cpf = cpf.replace(/\D/g, "");

      let aluno = await AlunoModel.findOne({
        where: {
          cpf: cpf,
        },
      });
      console.log("paulo inutil", aluno);
      if (aluno == null) {
        res.send(crypto.encrypt({ sem_cadastro: true }, true));
      } else {
        let trocarSenha =
          await AlteracaoSenhaAlunoModel.alteracao_senha_aluno.create({
            timer: Date.now(),
            cpf_aluno: aluno.cpf,
            status: "1",
          });

        crypto.Bcrypt.hash(
          trocarSenha.id.toString(),
          crypto.Salt,
          async function (err, hash) {
            if (hash) {
              await AlteracaoSenhaAlunoModel.alteracao_senha_aluno.update(
                { hash: hash },
                { where: { id: trocarSenha.id } }
              );

              if (hash.includes("/")) {
                hash = hash.replace(/\//g, "-");
              }

              objRetorno = {
                emailSent: false,
                sem_cadastro: false,
                aluno: {
                  nome: aluno.nome + " " + aluno.sobrenome,
                  email: aluno.email,
                },
              };

              let retornoEmail = await email.sendEmailSenha({
                aluno,
                hash: hash,
              });

              if (retornoEmail.accepted.length > 0) {
                objRetorno.emailSent = true;
              }

              res.send(crypto.encrypt(objRetorno, true));
            } else {
              res.status(500).send();
            }
          }
        );
      }
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  };

  const multer = require("multer");
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "upload/");
    },
    filename: function (req, file, cb) {
      const cpf = req.query.x;
      // Extração da extensão do arquivo original:
      const extensaoArquivo = file.originalname.split(".")[1];

      // Indica o novo nome do arquivo:
      cb(null, `${cpf}.png`);
    },
  });
  const upload = multer({ storage });
  app.post(
    "/usuario/carteirinha",
    upload.single("file"),
    function (req, res, next) {
      // req.file is the `avatar` file
      // req.body will hold the text fields, if there were any
      res.send(true);
    }
  );
  return this;
};

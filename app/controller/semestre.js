module.exports = (app) => {
    const crypto = app.utils.crypto;

    const semestreModel = app.orm_model.semestre;
    const periodoModel = app.orm_model.periodo;
    const vendedorModel = app.orm_model.vendedor;
    const representanteModel = app.orm_model.representante;
    const carteirinhaModel = app.orm_model.carteirinha;

    semestreModel.semestres.hasMany(periodoModel.periodos, { foreignKey: 'id_semestre_periodo', sourceKey: 'id_semestre' });
    periodoModel.periodos.hasOne(vendedorModel.vendedores, { foreignKey: 'id_periodo_vendedor', sourceKey: 'id_periodo' });

    this.getSemestres = async function (req, res) {
        try {
            if (!req.query.data) return res.send(crypto.encrypt({ graduacao: [], especializacao: [] }, true));
            let id_faculdade = crypto.decrypt(req.query.data, true);
            let semestres = await semestreModel.semestres.findAll({
                include: {
                    model: periodoModel.periodos,
                    include: {
                        model: vendedorModel.vendedores
                    },
                    where: {
                        status_periodo: '1',
                        situacao_periodo: '1'
                    },
                },
                where: {
                    id_faculdade_semestre: id_faculdade
                },
                order: [
                    ['cod_semestre', 'ASC'],
                ],
            })

            let graduacao = []
            let especializacao = []

            for (semestre of semestres) {
                semestre.pos_graduacao == '1' ? especializacao.push(semestre) : graduacao.push(semestre)
            }

            res.send(crypto.encrypt({ graduacao: graduacao, especializacao: especializacao }, true));
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    }
    this.getRepresentantes = async function (req, res) {
        try {
            let data = crypto.decrypt(req.query.data, true)

            let id_semestre = data.id_semestre
            let id_faculdade = data.id_faculdade;
            let cod_periodo = data.cod_periodo

            let representantes = await representanteModel.representantes.findAll({
                where: {
                    id_semestre_representante: id_semestre,
                    id_faculdade_representante: id_faculdade,
                    periodo_representante: cod_periodo,
                    status_representante: 1,
                    situacao_representante: 1,
                },
            })

            res.send(crypto.encrypt(representantes, true));
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    }

    this.getCarteirinha = async function (req, res) {
        try {
            let dados = JSON.parse(req.query.data);
            console.log('opa', dados);
            let retorno = await carteirinhaModel.findAll({
                plain: true,
                where: {
                    id_semestre: dados
                }
            })

            res.status(200).send(retorno)
        } catch (error) {
            console.log(error);
            res.status(200).send(false)
        }
    }

    return this;
}
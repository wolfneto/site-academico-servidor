module.exports = (app) => {
    const crypto = app.utils.crypto;
    const faculdadeModel = app.orm_model.faculdade;

    this.getFaculdades = async function (req, res) {
        try {
            let faculdades = await faculdadeModel.faculdades.findAll({
                where: {
                    id_faculdade: {
                        [faculdadeModel.sequelize.Op.ne]: 0,
                    },
                    situacao_faculdade: 1
                },
                order: [
                    ['status', 'DESC'],
                    ['nome_exibicao_faculdade', 'ASC'],
                ],
            });
            res.send(crypto.encrypt(faculdades, true))
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    }
    return this;
}
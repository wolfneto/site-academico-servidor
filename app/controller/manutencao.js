module.exports = (app) => {
    const crypto = app.utils.crypto;

    const manutencaoModel = app.orm_model.manutencao;

    this.getManutencao = async function (req, res) {
        try {
            let manutencao = await manutencaoModel.manutencao.findOne({});

            res.send(crypto.encrypt(manutencao, true))
        } catch (error) {
            console.log(error);
            res.status(500).send()
        }
    }

    return this;
}
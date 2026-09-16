module.exports = (app) => {
    const crypto = app.utils.crypto;

    const manutencaoModel = app.orm_model.manutencao;

    this.getManutencao = async function (req, res) {
        try {
            let manutencao = await manutencaoModel.manutencao.findOne({});

            if (!manutencao) {
                manutencao = await manutencaoModel.manutencao.create({
                    manutencao: 0,
                    msg_manutencao: ''
                });
            }

            const payload = manutencao?.dataValues || manutencao;
            res.send(crypto.encrypt(payload, true));
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    }

    return this;
}
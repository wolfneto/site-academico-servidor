module.exports = (app) => {
    const crypto = app.utils.crypto;

    const ip_liberadoModel = app.orm_model.ip_liberado;

    this.getIpLiberado = async function (req, res) {
        try {
            let ips_liberados = await ip_liberadoModel.ip_liberado.findOne();
            res.send(crypto.encrypt(ips_liberados, true))
        } catch (error) {
            console.log(error);
            res.status(500).send()
        }
    }
    return this;
}
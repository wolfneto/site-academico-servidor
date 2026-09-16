module.exports = (app) => {
    const crypto = app.utils.crypto;

    const ip_liberadoModel = app.orm_model.ip_liberado;

    this.getIpLiberado = async function (req, res) {
        try {
            let ips_liberados = await ip_liberadoModel.ip_liberado.findOne();

            if (!ips_liberados) {
                ips_liberados = await ip_liberadoModel.ip_liberado.create({
                    id: 1,
                    ip: ""
                });
            }

            const payload = ips_liberados?.dataValues || ips_liberados;
            res.send(crypto.encrypt(payload, true));
        } catch (error) {
            console.log(error);
            res.send(crypto.encrypt({ id: 1, ip: "" }, true));
        }
    }
    return this;
}
module.exports = (app) => {
    const crypto = app.utils.crypto;

    const avisoModel = app.orm_model.aviso;

    this.getAvisos = async function (req, res) {
        try {
            let data = crypto.decrypt(req.query.data, true)

            let id_semestre_aviso = data.id_semestre_aviso;
            let id_faculdade_aviso = data.id_faculdade_aviso;

            let avisos = await avisoModel.aviso.findAll({
                where: {
                    id_semestre_aviso: id_semestre_aviso,
                    id_faculdade_aviso: id_faculdade_aviso,
                }
            });

            res.send(crypto.encrypt(avisos, true))
        } catch (error) {
            console.log(error);
            res.status(500).send()
        }
    }
    this.getAvisoGeral = async function (req, res) {
        try {
            let avisos = await avisoModel.aviso_geral.findAll();

            res.send(crypto.encrypt(avisos, true))
        } catch (error) {
            console.log(error);
            res.status(500).send()
        }
    }


    return this;
}
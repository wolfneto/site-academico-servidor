module.exports = (app) => {
    const crypto = app.utils.crypto;

    const avisoModel = app.orm_model.aviso;

    this.getAvisos = async function (req, res) {
        try {
            if (!req.query.data) {
                return res.status(400).send(crypto.encrypt([], true))
            }

            let data = crypto.decrypt(req.query.data, true)

            let where = {};
            if (data.id_semestre_aviso != null) where.id_semestre_aviso = data.id_semestre_aviso;
            if (data.id_faculdade_aviso != null) where.id_faculdade_aviso = data.id_faculdade_aviso;

            if (Object.keys(where).length === 0) {
                return res.status(400).send(crypto.encrypt([], true))
            }

            let avisos = await avisoModel.aviso.findAll({ where });

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
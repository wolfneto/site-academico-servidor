module.exports = (app) => {
    const kitAcademicoModel = app.orm_model.kit_academico;
    const semestreModel = app.orm_model.semestre;
    const periodoModel = app.orm_model.periodo;
    const vendedorModel = app.orm_model.vendedor;
    const kitAcademicoItemModel = app.orm_model.kit_academico_item;

    const crypto = app.utils.crypto;

    semestreModel.semestres.hasMany(kitAcademicoModel.kit_academico, { foreignKey: 'id_semestre', sourceKey: 'id_semestre' })
    periodoModel.periodos.hasOne(vendedorModel.vendedores, { foreignKey: 'id_cod_periodo_vendedor', sourceKey: 'cod_periodo' });
    kitAcademicoModel.kit_academico.hasMany(kitAcademicoItemModel.kit_academico_item, { foreignKey: 'id_kit', sourceKey: 'id_kit' })

    this.getSemestresComkits = async function (req, res) {
        try {
            let id_faculdade = crypto.decrypt(req.body.data, true);
            let Semestres = await semestreModel.semestres.findAll({

                include: [{
                    model: kitAcademicoModel.kit_academico,
                    include: [{
                        model: kitAcademicoItemModel.kit_academico_item
                    }],
                    where: {
                        status_kit: '1'
                    }
                },
                {
                    model: periodoModel.periodos,
                    include: [{
                        model: vendedorModel.vendedores
                    }]
                }],
                where: {
                    id_faculdade_semestre: id_faculdade
                },
                order: [
                    ['descri_semestre', 'ASC'],
                ],
            })

            res.send(crypto.encrypt(Semestres, true));
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    }
    return this;
}
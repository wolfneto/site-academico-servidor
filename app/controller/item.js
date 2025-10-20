module.exports = (app) => {
    const itemModel = app.orm_model.item;

    this.getitems = async function (req, res) {
        try {
            itemModel.items.hasMany(itemModel.marcas, { foreignKey: 'id_item', sourceKey: 'id_item_marca' });

            let id_lista = req.query.id_lista;
            let items = await itemModel.items.findAll({
                include: [{
                    model: itemModel.marcas
                }],
                where: {
                    id_lista_item: {
                        [itemModel.sequelize.Op.eq]: id_lista,
                    }
                }
            });
            for (item of items) {
                if (item.dataValues.disponivel_item == 0) {
                    item.dataValues.selected = false;
                } else if (item.dataValues.opcional_item == 0) {
                    item.dataValues.selected = true;
                } else {
                    item.dataValues.selected = false;
                }
                item.dataValues.selectedMarca = item.dataValues.marcas[0]
            }
            console.log("ALGUMA COISA AQUI", items);
            res.send(items)
        } catch (error) {
            console.log(error);
            res.send(false);
        }
    }


    return this;
}
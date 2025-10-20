module.exports = (app) => {
    const lista = app.controller.lista;

    app.post('/listas', (req, res) => lista.getListas(req, res));
    app.post('/checarInfo', (req, res) => lista.checarInfo(req, res));
    app.get('/Kit_item', (req, res) => lista.getKitItem(req, res));
    
    return this;
}
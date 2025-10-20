module.exports = (app) => {
    const item = app.controller.item;

    app.get('/items', (req, res) => item.getitems(req, res));

    return this;
}
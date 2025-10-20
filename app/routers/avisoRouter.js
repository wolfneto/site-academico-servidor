module.exports = (app) => {
    const aviso = app.controller.aviso;

    app.get('/avisos', (req, res) => aviso.getAvisos(req, res));
    app.get('/avisoGeral', (req, res) => aviso.getAvisoGeral(req, res));

    return this;
}
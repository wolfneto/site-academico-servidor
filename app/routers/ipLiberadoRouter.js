module.exports = (app) => {
    const ip_liberado = app.controller.ip_liberado;

    app.get('/ip_liberado', (req, res) => ip_liberado.getIpLiberado(req, res));

    return this;
}
module.exports = (app) => {
    const usuario = app.controller.usuario;

    const middleWare = app.utils.middleWare

    // usuario /usuario/trocarSenha

    app.get('/usuario', middleWare.isAuthenticated, (req, res) => usuario.getUsuario(req, res));
    app.get('/checarCPF', (req, res) => usuario.checarCPF(req, res));
    app.get('/usuario/trocarSenha', (req, res) => usuario.getTrocarSenha(req, res));
    app.put('/usuario/trocarSenha', (req, res) => usuario.updateTrocarSenha(res, req));
    app.put('/usuario', middleWare.isAuthenticated, (req, res) => usuario.update(res, req));
    app.put('/usuario/senha', middleWare.isAuthenticated, (req, res) => usuario.updateSenha(res, req));
    app.put('/usuario/email', (req, res) => usuario.updateEmail(res, req));
    app.post('/usuario/session', (req, res) => usuario.upsertSession(req, res));
    app.post('/usuario/posVenda', middleWare.isAuthenticated, (req, res) => usuario.sendEmailPosVenda(res, req));
    app.post('/usuario/recuperaSenha', (req, res) => usuario.sendEmailSenha(res, req));
    app.post('/usuario/salvarEnderecoEntrega', (req, res) => usuario.salvarEnderecoEntrega(req, res));
    app.get("/hashtudo", (req, res) => usuario.hashtudo(res, req));
    return this;
}
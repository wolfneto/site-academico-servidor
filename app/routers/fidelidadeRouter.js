module.exports = (app) => {
    const fidelidade = app.controller.fidelidade;

    const middleWare = app.utils.middleWare

    app.get('/fidelidade', middleWare.isAuthenticated, (req, res) => fidelidade.getFidelidade(req, res)); 
    app.get('/resgate', middleWare.isAuthenticated, (req, res) => fidelidade.getResgate(req, res)); 
    app.post('/resgate', middleWare.isAuthenticated, (req, res) => fidelidade.salvarResgate(req, res)); 
    app.post('/fidelidadeContato', middleWare.isAuthenticated, (req, res) => fidelidade.sendEmailFidelidadeContato(res, req));

    return this;
}
module.exports = (app) => {
    const semestre = app.controller.semestre;

    app.get('/semestres', (req, res) => semestre.getSemestres(req, res));
    app.get('/representantes', (req, res) => semestre.getRepresentantes(req, res));
    app.get('/carteirinha', (req, res) => semestre.getCarteirinha(req, res));
 
    return this;
}
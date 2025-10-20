module.exports = (app) => {
    const kit_academico = app.controller.kit_academico;

    app.post('/semestrekits', (req, res) => kit_academico.getSemestresComkits(req, res));
    
    return this;
}
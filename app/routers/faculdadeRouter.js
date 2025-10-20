module.exports = (app) => {
    const faculdade = app.controller.faculdade;

    app.get('/faculdades', (req, res) => faculdade.getFaculdades(req, res));  
    
    return this;
}
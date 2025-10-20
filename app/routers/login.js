module.exports = (app) => {
    const crypto = app.utils.crypto;

    const Passport = app.plugins.passport;

    app.post('/login', (req, res, next) => {
        req.body = crypto.decrypt(req.body.data, true)
        Passport.authenticate("local", (err, user) => {
            if (err) {
                //erro interno
                return res.send({ success: false, error: true });
            }
            if (!user) {
                //senha ou cpf incorretos
                return res.send({ success: false, error: false });
            }
            req.login(user, err => {
                //sucesso
                user.success = true;
                res.send(user);
            });
        })(req, res, next);
    })

    app.get("/logout", function(req, res) {
        req.logout();
        return res.send();
    });


    return this;
}
module.exports = (app) => {
    const crypto = app.utils.crypto;

    const Passport = app.plugins.passport;

    app.post("/login", (req, res, next) => {
        req.body = crypto.decrypt(req.body.data, true);

        Passport.authenticate("local", (authError, user) => {
            if (authError) {
                console.error("[AUTH] Falha na autenticação:", authError);
                return res.status(500).send({ success: false, error: true });
            }

            if (!user) {
                // Credenciais inválidas: o cliente atual espera success:false.
                return res.send({ success: false, error: false });
            }

            req.login(user, (loginError) => {
                if (loginError) {
                    console.error("[AUTH] Falha ao criar a sessão:", loginError);
                    return res.status(500).send({ success: false, error: true });
                }

                user.success = true;
                return res.status(200).send(user);
            });
        })(req, res, next);
    });

    app.get("/logout", function (req, res) {
        req.logout();
        return res.send();
    });


    return this;
}
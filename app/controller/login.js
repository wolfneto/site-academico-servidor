module.exports = (app) => {
    const Passport = app.plugins.passport;
    const alunoModel = app.orm_model.aluno;
    const crypto = app.utils.crypto;

    const LocalStrategy = require('passport-local').Strategy;

    Passport.use(
        new LocalStrategy({
                usernameField: "cpf", // nome da propriedade usuario
                passwordField: "senha" // nome da propriedade senha
            },

            async(username, password, done) => {
                let user = await alunoModel.findOne({
                    attributes: ['cpf', 'senha'],
                    where: {
                        cpf: username.replace(/[^\d]/g, "")
                    },
                    raw: true,
                })
                if (user == null) {
                    done(null, false)
                } else {
                    crypto.Bcrypt.compare(password, user.senha, function(err, result) {
                        if (result) {
                            delete user.senha
                            done(null, user)
                        } else {
                            done(null, false)
                        }
                    });

                }

                // crypto.Bcrypt.hash(password, crypto.Salt, async function (err, hash) {
                //     // Store hash in your password DB.
                //     console.log(hash);              
                // });




            }
        )
    )

    Passport.serializeUser(async(user, done) => {
        done(null, user.cpf)
    })

    Passport.deserializeUser(async(cpf, done) => {
        let user = await alunoModel.findOne({
            where: {
                cpf: cpf
            },
            raw: true
        })

        done(null, user)
    })
    return this;
}
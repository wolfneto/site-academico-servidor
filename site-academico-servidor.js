const express = require('express'),
    consign = require('consign'),
    cors = require('cors'),
    busboy = require('connect-busboy'),
    xss = require('xss-clean'),
    helmet = require('helmet'),
    rateLimit = require("express-rate-limit"),
    history = require('connect-history-api-fallback'),
    cookieSession = require('cookie-session'),
    port = 3002,
    app = express();

// const publicRoot = '/home/academico/www/'
// const staticFileMiddleware = express.static(publicRoot)
// app.use(staticFileMiddleware);
// app.use(history());
// app.use(staticFileMiddleware);

// app.get("/", (req, res, next) => {
//     res.render(publicRoot + "/index.html")
// })

const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 1000 // limit each IP to 100 requests per windowMs
});

var allowedOrigins = ['https://academicosolident.com.br', 'https://solident.com.br'];

app.use(cors({
    credentials: true,
    origin: function(origin, callback) {
        console.log('oporra', origin);
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin || origin == undefined) return callback(null, true);
        // if (allowedOrigins.indexOf(origin) === -1) {
        //     var msg = 'The CORS policy for this site does not ' +
        //         'allow access from the specified Origin.';
        //     return callback(new Error(msg), false);
        // }
        return callback(null, true);
    },
}));

app.use(busboy());
app.use(express.json({ limit: '200mb' }))
app.use(cookieSession({
    name: 'slt_cookie',
    keys: ['46586c4404172f546540eeb20e'],
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
}));
app.use(xss());
app.use(helmet());
//app.use(limiter);
/**
 * Autoload com o consign
 */
consign({ cwd: 'app' })
    .include('database')
    .then('utils')
    .then('plugins')
    .then('orm_model')
    .then('controller')
    .then('routers')
    .into(app);

app.listen(port, () => {
    console.log(`servidor rodando no endereço: http://localhost:${port}`)
})

console.log("teste aaaaaaaaaa");

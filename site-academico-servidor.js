require('dotenv').config();

const express = require('express'),
consign = require('consign'),
cors = require('cors'),
busboy = require('connect-busboy'),
xss = require('xss-clean'),
helmet = require('helmet'),
rateLimit = require("express-rate-limit"),
history = require('connect-history-api-fallback'),
cookieSession = require('cookie-session'),
port = process.env.PORT || 3002,
app = express();

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 1000
});

var allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
if (allowedOrigins.length === 0) {
  allowedOrigins = ['https://academicosolident.com.br', 'https://solident.com.br'];
}

app.use(cors({
  credentials: true,
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, true);
    }
    return callback(null, true);
  },
}));

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.use(busboy());
app.use(express.json({ limit: '200mb' }))
app.use(cookieSession({
  name: 'slt_cookie',
  keys: ['46586c4404172f546540eeb20e'],
  maxAge: 24 * 60 * 60 * 1000,
}));
app.use(xss());
app.use(helmet());
//app.use(limiter);

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

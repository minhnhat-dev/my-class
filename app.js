const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const responseTime = require('response-time');
const session = require('express-session');
const passport = require('passport');
const socketio = require('socket.io');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const http = require('http');
const { REDIS_PORT, REDIS_URL, SESSION_SECRET } = require('./datasources/redis/configs');
const { loginFacebook } = require('./middlewares/login.facebook');
const { loginGoogle } = require('./middlewares/login.google');
const routes = require('./routes');
const { errorMiddleware } = require('./middlewares/error-handlers');
const { verifyToken } = require('./middlewares/authentication');
require('express-async-errors');
require('./datasources');

const redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
});

const app = express();
/* connect database */
/* apply auth facebook, google */
// loginFacebook(passport);
// loginGoogle(passport);

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});
/* passport session */
// app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(require('./middlewares/redact'));
app.use(require('./middlewares/normalize-mongoose'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());
app.use(responseTime());

/* use redis session */
app.enable('trust proxy');
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
        resave: false,
        httpOnly: true,
        secure: false,
        saveUninitialized: false,
        maxAge: 300000 // 300s
    }
}));

app.get('/', (req, res) => { res.render(path.resolve('./views/index.ejs')); });

app.get('/ping', (req, res) => {
    console.log('Accept ping !');
    res.status(200).send({ message: `Pong ${process.env.PORT} !!! ^^` });
});

app.use(routes);
app.use(errorMiddleware);

module.exports = app;

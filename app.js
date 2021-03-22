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
const { loginFacebook } = require('./middlewares/login.facebook');
const { loginGoogle } = require('./middlewares/login.google');
const routes = require('./routes');
const { errorMiddleware } = require('./middlewares/error-handlers');
const { verifyToken } = require('./middlewares/authentication');
require('express-async-errors');
require('./datasources');

const app = express();
/* connect database */

/* apply auth facebook, google */
loginFacebook(passport);
// loginGoogle(passport);

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());
app.use(responseTime());

/* routes */
app.get('/',
    (req, res) => {
    // console.log('req.session', req.session.passport);
        res.render(path.resolve('./views/index.ejs'));
    });

app.route('/login').get(async (req, res) => {
    res.render(path.resolve('./views/user/login.ejs'));
});
/* login with facebook */
app.get('/login/facebook', passport.authenticate('facebook'));
/* login with google */
app.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }));

/* callback login with facebook */
app.get(
    '/auth/facebook',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        const { user } = req;
        res.send(user);
    }
);

/* callback login with facebook */
app.get(
    '/auth/google',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    }
);

app.use(routes);
app.use(errorMiddleware);

module.exports = app;

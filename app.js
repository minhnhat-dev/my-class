const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser') ;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const errorhandler = require('errorhandler');
const notifier = require('node-notifier');
const compression = require('compression');
const responseTime = require('response-time');
const {authention} = require('./middlewares/authention');
const {loginFacebook} = require('./middlewares/login.facebook');
const {loginGoogle} = require('./middlewares/login.google');
const routes = require('./routes');
const {errorMiddleware} = require('./middlewares/error-handlers');
const mongoose = require(path.resolve('./db-helpers/mongoose-init'));
const session = require('express-session');
const PostsMD = require(path.resolve('./models/posts.model.js'));
const passport = require('passport');

var app = express();
/* connect database */
mongoose.connect();

/* apply auth facebook, google */
loginFacebook(passport);
loginGoogle(passport);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(session({secret: 'secret', resave: true, saveUninitialized: true}));
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
  function(req, res) {
    // console.log('req.session', req.session.passport);
    res.render(path.resolve('src/views/index.ejs'));
  });


app.route('/login').get(async function (req, res) {
  res.render(path.resolve('src/views/user/login.ejs'));
});

/* login with facebook */
app.get('/auth/facebook',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/login/facebook',
  passport.authenticate('facebook'));

/* login with google */
app.get('/login/google',
  passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }));

app.get('/auth/google',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


app.use('/api', routes);
app.use(errorMiddleware);
app.use(errorhandler({ log: errorNotification }));
function errorNotification (err, str, req) {
  var title = 'Error in ' + req.method + ' ' + req.url;

  notifier.notify({
    title: title,
    message: str
  });
}

module.exports = app;

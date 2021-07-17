const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const responseTime = require("response-time");
const session = require("express-session");
const passport = require("passport");
const socketio = require("socket.io");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const http = require("http");
const { REDIS_PORT, REDIS_URL, SESSION_SECRET } = require("./datasources/redis/configs");
const { loginFacebook } = require("./middlewares/login.facebook");
const { loginGoogle } = require("./middlewares/login.google");
const routes = require("./routes");
const { errorMiddleware } = require("./middlewares/error-handlers");
const { verifyToken } = require("./middlewares/authentication");
require("express-async-errors");
require("./datasources");

console.log("REDIS_URL", REDIS_URL);
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
app.use(require("./middlewares/redact"));
app.use(require("./middlewares/normalize-mongoose"));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// if (["localhost", "development"].includes(process.env.NODE_ENV)) {
//     app.use(morgan("dev"));
// } else {
//     app.use(morgan("common"));
// }

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());
app.use(responseTime());

/* use redis session */
app.enable("trust proxy");
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

const skipUrls = ["/ping/", "/ping"];
const morganOptions = { skip: (req) => skipUrls.includes(req.url) };
// app.use(morgan(config.morgan_log_format, morganOptions));
app.use(morgan("combined", morganOptions));

app.get("/", (req, res) => { res.render(path.resolve("./views/index.ejs")); });
const { APPID, PORT } = process.env;
app.get("/ping", (req, res) => {
    res.status(200).send({ message: `Pong ${process.env.PORT} APPID ${APPID} !!!` });
});

app.get("/api1", (req, res) => {
    console.log("api1");
    console.log("req.headers", req.headers);
    const ip = req.headers["x-forwarded-for"] || "";
    res.status(200).send(`api1 ===> APPID: ${APPID}, id: ${ip}`);
});

app.get("/api2", (req, res) => {
    console.log("req.headers", req.headers);
    const ip = req.headers["x-forwarded-for"] || "";
    res.status(200).send(`api2 ===> APPID: ${APPID}, id: ${ip}`);
});

app.use(routes);
app.use(errorMiddleware);

module.exports = app;

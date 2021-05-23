// const redis = require('redis');
// const session = require('express-session');
// const RedisStore = require('connect-redis')(session);
// const { REDIS_PORT, REDIS_URL, SESSION_SECRET } = require('./configs');

// const redisClient = redis.createClient({
//     host: REDIS_URL,
//     port: REDIS_PORT
// });

// session({
//     store: new RedisStore({ client: redisClient }),
//     secret: SESSION_SECRET,
//     cookie: {
//         resave: false,
//         httpOnly: true,
//         secure: false,
//         saveUninitialized: false,
//         maxAge: 30000 // 30s
//     }
// });

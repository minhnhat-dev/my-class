const createError = require('http-errors');
const { Strategy } = require('passport-facebook');
const {
    JWT_SECRET,
    accessTokenData,
    roles,
    ngrok,
    REALM
} = require('../configs');

function loginFacebook(passport) {
    passport.use(new Strategy({
        clientID: '560869681324758',
        clientSecret: '379f3ad07e8734868ce74c0e5e682d30',
        callbackURL: `${ngrok}/auth/facebook`
    },
    ((accessToken, refreshToken, profile, cb) => cb(null, { accessToken, refreshToken, profile }))));
}

module.exports = {
    loginFacebook
};

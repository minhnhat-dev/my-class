const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { functions } = require('lodash');
require('express-async-errors');
const {
    JWT_SECRET
} = require('../configs');

function signAccessToken(user) {
    return jwt.sign({
        iss: 'minhnhat.dev',
        id: user._id
        // exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, JWT_SECRET);
}

function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization || '';
        console.log('token', token);
        /* Verify access token */
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('decoded', decoded);
        req.userId = decoded.id;
        req.token = token;
        req.decoded = decoded;
        next();
    } catch (err) {
        console.error('VerifyToken Err', err);
        const error = new createError.Unauthorized('Access token expired');
        error.code = 'ACCESS_TOKEN_EXPIRED';
        next(err);
    }
}

function verifySession(req, res, next) {
    const { user } = req.session;

    if (!user) {
        throw new createError.Unauthorized('Access session expired');
    }

    req.user = user;
    next();
}

module.exports = {
    verifyToken,
    signAccessToken,
    verifySession
};

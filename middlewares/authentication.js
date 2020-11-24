const createError = require('http-errors');
const jwt = require('jsonwebtoken');
require('express-async-errors');
const {
  JWT_SECRET,
} = require('../configs');

function signAccessToken(user) {
  return jwt.sign({
    iss: 'minhnhat.dev',
    sub: user._id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
  }, JWT_SECRET);
}

function verifyToken(req, res, next) {
  let error;
  const token = req.headers.authorization || '';
  /* Verify access token */
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      error = new createError.Unauthorized('Access token expired');
      error.code = 'ACCESS_TOKEN_EXPIRED';
      next(error);
    }
    req.userId = decoded.id;
    req.token = token;
    req.decoded = decoded;
    next();
  });
}

module.exports = {
  verifyToken,
  signAccessToken,
};

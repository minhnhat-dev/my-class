const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { functions } = require("lodash");
require("express-async-errors");
const {
    JWT_SECRET
} = require("../configs");

function signAccessToken(user) {
    return jwt.sign({
        iss: "minhnhat.dev",
        id: user._id
    }, JWT_SECRET);
}

function verifyToken(req, res, next) {
    try {
        const authorization = req.headers.authorization || "";
        const token = authorization.split(" ")[1];

        if (!token) {
            throw new createError.Unauthorized("error_unauthorized");
        }
        /* Verify access token */
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("decoded", decoded);
        req.userId = decoded.id;
        req.token = token;
        req.decoded = decoded;
        next();
    } catch (err) {
        console.error("VerifyToken Err", err);
        const error = new createError.Unauthorized("error_unauthorized");
        error.code = "error_unauthorized";
        next(error);
    }
}

function verifySession(req, res, next) {
    const { user } = req.session;

    if (!user) {
        throw new createError.Unauthorized("Access session expired");
    }

    req.user = user;
    next();
}

module.exports = {
    verifyToken,
    signAccessToken,
    verifySession
};

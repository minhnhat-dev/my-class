const createError = require("http-errors");

function errorMiddleware(error, req, res, next) {
    console.error(error);
    return res.status(error.status || 500).send({
        code: error.code,
        error: error.message
    });
}

module.exports = {
    errorMiddleware
};

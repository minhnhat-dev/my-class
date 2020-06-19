'use strict'
const createError = require('http-errors');

function errorMiddleware(error, req, res, next) {
	const status = error.status || 500;
	console.error('errorMiddleware -----> ', error);
	if (status == 500) {
		error = new createError.BadRequest('InternalServerError');
		error.code = 'InternalServerError';
	}
	const stack = error.toString() + error.stack.toString();
	return res.status(status).send({error, stack});
}
module.exports = {
	errorMiddleware,
};
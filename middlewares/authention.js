'use strict';
const createError = require('http-errors');
const AccessToken = require('../models/access-token.model');

const {
	JWT_SECRET,
} = require('../configs');
const jwt = require('jsonwebtoken');

/**
 * verifyToken
 */

class Authentication {
	constructor(){}

	/**
	 * Sign accesstoken
	 *
	 * @param      {<type>}  user   The user
	 * @return     {<type>}  The access token.
	 */
	signAccessToken (user) {
		return jwt.sign({
			iss: 'minhnhat.dev',
			sub: user._id,
			iat: new Date().getTime(), // current time
			exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
		}, JWT_SECRET);
	}

	/**
	 * Verify token.
	 *
	 * @param      {<type>}  req   The req
	 * @param      {<type>}  res  The res
	 * @return     {<type>}  req.userId, req.tokenData.
	 */
	async verifyToken (req, res, next) {
		let error;
		const token = req.headers['authorization'] || '';
		const accessToken = await AccessToken.findOne({token});

		if(!accessToken) {
			error = new createError.Unauthorized('Unauthorized');
			error.code = 'UNAUTHORIZED';
			return next(error);
		}

		/* Verify access token */
		jwt.verify(token, JWT_SECRET, function(err, decoded) {
			if (err) {
				error = new createError.Unauthorized('Access token expired');
				error.code = 'ACCESS_TOKEN_EXPIRED';
				return next(error);
			}
			req.userId = decoded.id;
			req.tokenData = decoded;
			return next();
		});
	}

	/**
	 * Create access token in database.
	 *
	 * @param      {<type>}  params   The params
	 * @return     {<type>}  The new access token.
	 */
	createAccessToken (params) {
		const {userId, ttl, token,scopes} = params;
		return AccessToken.create({userId, token, ttl, scopes});
	}

	/**
	 * Create access token in database.
	 *
	 * @param      {<type>}  params   The params
	 * @return     {<type>}  The new access token.
	 */
	verifyRoles (roles) {
		console.log('role', roles);
		return function (req, res, next) {
			console.log('requireRole');
			next();
		};
	}

}
module.exports = Authentication;

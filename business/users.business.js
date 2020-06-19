'use strict';
const User = require('../models/users.model');
const {createAccessToken} = require('../middlewares/authention');

class Users {
	constructor(){}

	async create(data) {
		try{
			const {facebookId, accessToken} = data;
			const params = {
				token: accessToken,
				ttl: 86400,
				scopes: ['login'],
			};
			const promise = [];
			promise.push(User.findOneOrCreate({facebookId}, data));
			promise.push(createAccessToken(params));
			return Promise.all(promise);
		} catch (error) {
			throw error;
		}
	}
}
module.exports = Users;
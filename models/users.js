'use strict';
const Authentication = require('../middlewares/authention');
const {validate} = require('../validator');
const UserModel = require('../models/users.model');
const User = {};
const authentication = new Authentication();
/**
	 * Register
	 *
	 * @param      {<type>}  req   The req
	 * @param      {<type>}  res   The res
	 * @return     {<type>}  The access token.
	 */
User.register = async function (req, res) {
	try {
		let data = req.body || {};
		data = validate('input-register-user', data);
		const user = await UserModel.create(data);
		const token = authentication.signAccessToken(user);

		const params = {
			userId: user._id,
			token,
			ttl: 86400,
			scopes: ['login'],
		};
		await authentication.createAccessToken(params);
		return res.status(200).send({user, token});
	} catch (error) {
		throw error;
	}
};

User.getUsers = async function (req, res) {
	try {
		const users = await UserModel.find({});
		res.status(200).send({users});
	} catch (error) {
		throw error;
	}
};

User.login = async function (req, res) {
	try {
		const users = await UserModel.find({});
		res.status(200).send({users});
	} catch (error) {
		throw error;
	}
};

User.findOneOrCreate = async function  (query, data) {
	try{
		const self = this;
		const role = await this.findOne(query);
		if(!role) {
			return self.create(data);
		} else {
			return;
		}
	} catch (e) {
		throw new Error(e);
	}
};

module.exports = User;
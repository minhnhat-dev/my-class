const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const RoleMapping = require('./role-mapping.model');
const ObjectId = require('mongodb').ObjectID;

const UserSchema = new Schema({
	fullName: {type: String, default: null},
	firstName: {type: String, default: null},
	lastName: {type: String, default: null},
	displayName: {type: String, default: null},
	password: {type: String, default: null},
	phone: {type: String, default: null},
	email: {type: String, default: null},
	picture: {type: String, default: null},
	userType: {type: String, default: null},
	status: {type: String, default: 'active'},
	realm: {type: String, default: null},
	roles: [],
	facebookId: {type: String, default: null},
	googleId: {type: String, default: null},
}, { versionKey: false, timestamps: true });

/**
 * Defined statics access control list on User
 */
UserSchema.statics.acls = [
	{
		path: '/register',
		verb: 'post',
		roles: [],
		method: 'register',
		authenticated: false
	},
	{
		path: '/',
		verb: 'get',
		roles: [],
		method: 'getUsers',
		authenticated: true
	},
];


/**
 * Hook hide field safe
 */

UserSchema.method('toJSON', function() {
	const user = this.toObject();
	delete user.password;
	return user;
});

/**
 * Hook before save
 * Hash password
 */
UserSchema.pre('save', async function (next) {
	try{
		const salt = await bcrypt.genSalt(10);
		if(this.password){
			const passwordHash = await bcrypt.hash(this.password, salt);
			this.password = passwordHash;
		}
		next();
	} catch (e) {
		next(e);
	}
});

/**
 * Hook after save:
 */
UserSchema.post('save', async function(doc, next) {
	const {roles, realm} = doc;
	const promise = [];

	/* Create roles mapping */
	roles.forEach(roleId => {
		promise.push(
			RoleMapping.create(
				{
					principalType: realm || '',
					principalId: doc._id || '',
					roleId: ObjectId(roleId) || '',
				}
			)
		);
	});
	Promise.all(promise).then(() => next()).catch(error =>{throw error;});
});

UserSchema.methods.validatePassword = async function  (password) {
	try{
		return await bcrypt.compare(password, this.password);
	} catch (e) {
		throw new Error(e);
	}
};

module.exports = mongoose.model('Users', UserSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
	name: {
		type: String,
		default: null,
		index: true,
		unique: true
	},
}, { versionKey: false, timestamps: true });


RoleSchema.statics.findOneOrCreate = async function  (query, data) {
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


module.exports = mongoose.model('Roles', RoleSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleMappingSchema = new Schema({
	principalType: {type: String, default: null},
	principalId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	roleId: {type: mongoose.Schema.Types.ObjectId, ref: 'Roles'},
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('RoleMapping', RoleMappingSchema);
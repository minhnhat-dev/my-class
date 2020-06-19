const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccessTokenSchema = new Schema({
	ttl: {type: Number, required: true},
	userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	token: {type: String, default: null},
	scopes: [String],
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('AccessTokens', AccessTokenSchema);
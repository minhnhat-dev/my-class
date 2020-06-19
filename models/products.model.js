
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
	'description': { type: String, default: '' },
	'images': [
		{
			fieldname: String,
			originalname: String,
			encoding: String,
			mimetype: String,
			filename:  String,
			link:  String,
			size:  Number,
		}
	],
	'type': { type: String, default: '' },
	'sku': { type: String, default: '', unique: true },
	'title': { type: String, default: '' },
	'name': { type: String, default: '' },
	'status': { type: String, default: 'active' },
	'bodyHtml': { type: String, default: '' },
	'publishedAt': { type: Date, default: null },
	'publishedScope': { type: String, default: '' },
	'tags': { type: []},
	'variants': [],
	'vendor': { type: String, default: '' },
	'options': [],
	'price': { type: Number, default: 0 },
	'priceSaleOff': { type: Number, default: 0 },
	'category': { type: String, default: '' },
	'published': { type: Boolean, default: false },
}, { versionKey: false, timestamps: true });

ProductsSchema.statics.status = {
	active: 'active',
	disabled: 'disabled'
};

module.exports = mongoose.model('Products', ProductsSchema);
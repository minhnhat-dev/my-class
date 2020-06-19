
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);
const Texts = new Schema({
  id: {type: Number, required: true, index: true, default: 1000},
  text: []
}, { versionKey: false });

module.exports = mongoose.model('Text', Texts);
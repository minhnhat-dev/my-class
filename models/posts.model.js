
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);
const PostsSchema = new Schema({
  id: {type: Number, required: true, index: true},
  created_at: {type: Date, default: null},
  updated_at: {type: Date, default: null},
  title: {type: String, default: null},
  title_sub: {type: String, default: null},
  name: {type: String, default: null},
  author: {type: String, default: null},
  content: {type: String, default: null},
  category: {type: String, default: null},
  rate: {type: String, default: null},
  images: [],
  tags: [],
  comments: [],
  views: {type: Number, default: null},
  text_search: {type: String, default: null},
  status: {type: Number, default: null},
  is_deleted: {type: Number, default: 0},
  title_images: []
}, { versionKey: false });


PostsSchema.plugin(autoIncrement.plugin, {
  model: 'Posts',
  field: 'id',
  startAt: 100000,
  incrementBy: 1
});

PostsSchema.statics.ACTIVE = 1;
PostsSchema.statics.DEACTIVE = 0;

PostsSchema.statics.IS_DELETED = 1;
PostsSchema.statics.NO_DELETED = 0;



module.exports = mongoose.model('Posts', PostsSchema);
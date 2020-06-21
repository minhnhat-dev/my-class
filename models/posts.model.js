
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostsSchema = new Schema({
  title: {type: String, default: null},
  titleSub: {type: String, default: null},
  name: {type: String, default: null},
  author: {type: String, default: null},
  content: {type: String, default: null},
  category: {type: String, default: null},
  rate: {type: String, default: null},
  images: [],
  tags: [],
  views: {type: Number, default: null},
  status: {type: Number, default: null},
}, { versionKey: false, timestamps: true});

/**
 * Defined statics access control list on User
 */
PostsSchema.statics.acls = [
  {
    path: '/',
    verb: 'post',
    roles: [],
    method: 'create',
    authenticated: false
  },
  {
    path: '/',
    verb: 'get',
    roles: [],
    method: 'getPosts',
    authenticated: false
  },
];

module.exports = mongoose.model('Posts', PostsSchema);
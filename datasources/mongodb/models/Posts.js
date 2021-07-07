const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const PostSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'Users',
  },
  text: String,
  likes: [
    {
      user: {
        type: ObjectId,
        ref: 'Users',
      },
    },
  ],
  comments: [
    {
      user: {
        type: ObjectId,
        ref: 'Users',
      },
      text: String,
      createdAt: Date,
      updatedAt: Date,
    },
  ],
  totalLike: {
    type: Number,
    default: 0,
  },
  totalComment: {
    type: Number,
    default: 0,
  },
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('Posts', PostSchema);

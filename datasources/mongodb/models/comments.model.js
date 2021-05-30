const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const CommentsSchema = new Schema({
    userId: ObjectId,
    postId: ObjectId,
    comments: String
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('Comments', CommentsSchema);

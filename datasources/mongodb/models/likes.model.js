const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const LikesSchema = new Schema({
    userId: ObjectId,
    postId: ObjectId,
    icon: String
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('Likes', LikesSchema);

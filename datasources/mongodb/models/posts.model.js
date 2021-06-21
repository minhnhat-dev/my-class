const mongoose = require("mongoose");
const { STATUS } = require("../../../constants/posts.constant");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const PostsSchema = new Schema({
    userId: ObjectId,
    description: String,
    image: {},
    status: {
        type: Number,
        default: STATUS.ACTIVE,
        enum: Object.values(STATUS)
    },
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model("Posts", PostsSchema);

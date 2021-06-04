const mongoose = require('mongoose');
const { STATUS } = require('../../../constants/followers.constant');

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const FollowersSchema = new Schema({
    userId: ObjectId,
    followerId: ObjectId,
    status: {
        type: Number,
        enum: Object.values(STATUS),
        default: STATUS.ACTIVE
    }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('Followers', FollowersSchema);

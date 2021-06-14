const mongoose = require("mongoose");
const crypto = require("crypto");
const { STATUS, RELATIONSHIP } = require("../../../constants/users.constant");

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: String,
    phone: String,

    salt: { type: String, required: true },
    hash: { type: String, required: true },
    email: { type: String, trim: true, unique: true, index: true, required: true },
    status: {
        type: Number,
        default: STATUS.ACTIVE,
        enum: Object.values(STATUS)
    },
    facebookId: String,
    googleId: String,
    profilePicture: String,
    coverPicture: String,
    from: String,
    city: String,
    description: String,
    relationship: {
        type: Number,
        enum: Object.values(RELATIONSHIP),
        default: RELATIONSHIP.OTHER
    },
    totalFollowers: { type: Number, default: 0 },
    totalFollowings: { type: Number, default: 0 }
}, { versionKey: false, timestamps: true });

UserSchema.methods.setPassword = function createPassword(password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, "sha512").toString("hex");
};

UserSchema.methods.validatePassword = async function validatePassword(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, "sha512").toString("hex");
    return this.hash === hash;
};
module.exports = mongoose.model("Users", UserSchema);

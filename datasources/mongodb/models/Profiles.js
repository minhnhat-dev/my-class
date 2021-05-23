const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ProfileSchema = new Schema({
    user: {
        type: ObjectId,
        ref: 'users',
        required: true,
        unique: true
    },
    name: String,
    handle: String,
    website: String,
    location: String,
    status: {
        type: String,
        required: true,
        enum: ['Show', 'Hide']
    },
    skills: {
        type: [String],
        required: true
    },
    experiences: [{
        projectName: String,
        description: String,
        technologyUsed: String,
        location: String,
        from: Date,
        to: Date,
        status: String,
        links: [String]
    }],
    educations: [{
        school: String,
        degree: String,
        major: String,
        from: Date,
        to: Date
    }],
    social: {
        youtube: String,
        twitter: String,
        facebook: String,
        linkedIn: String,
        instagram: String
    }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('Profiles', ProfileSchema);

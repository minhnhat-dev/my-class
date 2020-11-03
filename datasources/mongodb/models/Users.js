const mongoose = require('mongoose');

const { Schema } = mongoose;
const crypto = require('crypto');
const { isEmail } = require('validator');

const UserSchema = new Schema({
  fullName: String,
  firstName: String,
  lastName: String,
  phone: String,

  salt: { type: String, required: true },
  hash: { type: String, required: true },
  email: {
    type: String,
    trim: true,
    unique: 'Duplicate email ({VALUE})',
    index: {
      unique: true,
      partialFilterExpression: { email: { $type: 'string' } },
    },
    validate: [isEmail, 'invalid email address'],
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'disabled'],
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Facility Admin',
      'Call Center Technician', 'Call Center Supervisor',
      'Clinic Physician', 'Clinic Technician', 'Billing User',
      'Sales Admin', 'Sales Manager', 'Sales Representative'],
  },
  facebookId: String,
  googleId: String,
}, { versionKey: false, timestamps: true });


UserSchema.methods.setPassword = function createPassword(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = async function validatePassword(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};
module.exports = mongoose.model('Users', UserSchema);

const CreateError = require('http-errors');
const { validate } = require('./index');
const { Users } = require('../datasources/mongodb/models');

async function validatorCreate(body) {
    const data = validate('input-create-profiles', body);
    const { user: userId } = data;
    const user = await Users.findById(userId).lean();
    if (!user) {
        throw new CreateError.NotFound('error_user_invalid');
    }
    return { ...data, user };
}

async function validatorUpdate(body) {
    const data = validate('input-create-profiles', body);
    const { user: userId } = data;
    const user = await Users.findById(userId).lean();
    if (!user) {
        throw new CreateError.NotFound('error_user_invalid');
    }
    return { ...data, user };
}

module.exports = {
    validatorCreate
};

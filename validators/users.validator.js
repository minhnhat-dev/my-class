const axios = require('axios');
const CreateError = require('http-errors');
const faker = require('faker');
const { userConstant } = require('../constants');
const { Users } = require('../datasources/mongodb/models');
const { signAccessToken, verifyToken } = require('../middlewares/authentication');

async function validateAccessTokenFaceBook(body) {
    /* Get account id */
    const { accessToken } = body;

    if (!accessToken) throw new CreateError.Unauthorized('Unauthorized');

    const graphFacebookUrl = `${userConstant.GRAPH_FACEBOOK_URL}/me?access_token=${accessToken}`;
    const { data: userFacebook } = await axios.get(graphFacebookUrl);
    const { name, id } = userFacebook;

    if (!id) throw new CreateError.Unauthorized('Unauthorized');

    let user = null;
    user = await Users.findOne({ facebookId: id }).lean();

    if (!user) {
        const newUser = new Users({ name, facebookId: id });
        newUser.roles = ['Normal'];
        newUser.email = `${id}@gmail.com`;
        newUser.setPassword(faker.random.uuid());
        await newUser.save();
        user = newUser;
    }

    return {
        token: signAccessToken(user),
        user
    };
}

async function validateCreateUser(body) {
    const { email, password, passwordConfirm } = body;
    if (password !== passwordConfirm) {
        throw new CreateError.BadRequest('error_password_confirm_not_match');
    }

    const countEmail = await Users.countDocuments({ email });
    if (countEmail) {
        throw new CreateError.BadRequest('error_email_already_exists');
    }

    return body;
}

module.exports = {
    validateAccessTokenFaceBook,
    validateCreateUser
};

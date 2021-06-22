const axios = require("axios");
const CreateError = require("http-errors");
const faker = require("faker");
const { userConstant } = require("../constants");
const { Users, Followers, Followings } = require("../datasources/mongodb/models");
const { signAccessToken, verifyToken } = require("../middlewares/authentication");
const { ERROR_CODES } = require("../constants/users.constant");

async function validateAccessTokenFaceBook(body) {
    /* Get account id */
    const { accessToken } = body;

    if (!accessToken) throw new CreateError.Unauthorized("Unauthorized");

    const graphFacebookUrl = `${userConstant.GRAPH_FACEBOOK_URL}/me?access_token=${accessToken}`;
    const { data: userFacebook } = await axios.get(graphFacebookUrl);
    const { name, id } = userFacebook;

    if (!id) throw new CreateError.Unauthorized("Unauthorized");

    let user = null;
    user = await Users.findOne({ facebookId: id }).lean();

    if (!user) {
        const newUser = new Users({ name, facebookId: id });
        newUser.roles = ["Normal"];
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
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_PASSWORD_CONFIRM_NOT_MATCH);
    }

    const countEmail = await Users.countDocuments({ email });
    if (countEmail) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_EMAIL_ALREADY_EXISTS);
    }

    return body;
}

async function validateUserLogin(body) {
    const { email, password } = body;
    const user = await Users.findOne({ email });

    if (!user) {
        throw new CreateError.NotFound(ERROR_CODES.ERROR_USER_NOT_FOUND);
    }

    const isCorrect = await user.validatePassword(password);

    if (!isCorrect) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_PASSWORD_INVALID);
    }
    const token = signAccessToken(user);
    return { user, token };
}

async function validateUser(id) {
    const user = await Users.findById(id);

    if (!user) {
        throw new CreateError.NotFound(ERROR_CODES.ERROR_USER_NOT_FOUND);
    }

    return user;
}

async function validateUpdateUser(id, body) {
    const user = await validateUser(id);
    return body;
}

async function validateFollowUser(body) {
    const { userId, followerId } = body;

    if (userId === followerId) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_YOU_NOT_FOLLOW_YOURSELF);
    }

    const user = await validateUser(userId);
    const userFollwer = await validateUser(followerId);

    if (!userFollwer) {
        throw new CreateError.NotFound(ERROR_CODES.ERROR_USER_NOT_FOUND);
    }

    const countUserFollowing = await Followings.countDocuments({
        userId,
        followingId: followerId
    });

    if (countUserFollowing) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_YOU_ALREADY_FOLLOW_THIS);
    }

    return body;
}

async function validateUnFollowUser(body) {
    const { userId, unFollowerId } = body;

    if (userId === unFollowerId) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_YOU_NOT_UNFOLLOW_YOURSELF);
    }

    const user = await validateUser(userId);
    const userUnFollwer = await validateUser(unFollowerId);

    if (!userUnFollwer) {
        throw new CreateError.NotFound(ERROR_CODES.ERROR_USER_NOT_FOUND);
    }

    const countUserFollowing = await Followings.countDocuments({
        userId,
        followingId: unFollowerId
    });

    if (!countUserFollowing) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_YOU_NOT_FOLLOW_YET);
    }

    return body;
}

module.exports = {
    validateAccessTokenFaceBook,
    validateCreateUser,
    validateUserLogin,
    validateUser,
    validateUpdateUser,
    validateFollowUser,
    validateUnFollowUser
};

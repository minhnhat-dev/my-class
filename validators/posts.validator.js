const CreateError = require('http-errors');
const { Posts, Likes } = require('../datasources/mongodb/models');
const { ERROR_CODES } = require('../constants/posts.constant');
const { validateUser } = require('./users.validator');

async function validateCreatePost(body) {
    const { userId } = body;
    await validateUser(userId);
    return body;
}

async function validatePost(id) {
    const post = await Posts.findById(id);

    if (!post) {
        throw new CreateError.NotFound(ERROR_CODES.ERROR_POST_NOT_FOUND);
    }

    return post;
}

async function validateUpdatePost(id, body) {
    const { userId } = body;
    const post = await validatePost(id);

    if (post.userId.toString() !== userId) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_POST_INVALID);
    }

    return body;
}

async function validateLikePost(id, body) {
    const { userId } = body;
    await validatePost(id);

    const countLike = await Likes.countDocuments({ userId, postId: id });

    if (countLike) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_YOU_ALREADY_LIKE_POST);
    }

    return body;
}

async function validateUnLikePost(id, body) {
    const { userId } = body;
    await validatePost(id);

    const countLike = await Likes.countDocuments({ userId, postId: id });

    if (!countLike) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_YOU_NOT_LIKE_POST_YET);
    }

    return body;
}

module.exports = {
    validateCreatePost,
    validateUpdatePost,
    validatePost,
    validateLikePost,
    validateUnLikePost
};

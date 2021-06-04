/* eslint-disable radix */
const {
    validateCreatePost,
    validateUpdatePost,
    validatePost,
    validateLikePost,
    validateUnLikePost
} = require('../validators/posts.validator');

const { validateUser } = require('../validators/users.validator');
const { postsServices } = require('../services');

async function createPost(req, res, next) {
    const { body } = req;
    const data = await validateCreatePost(body);
    const post = await postsServices.createPost(data);
    return res.status(201).send(post);
}

async function updatePost(req, res, next) {
    const { body } = req;
    const { id } = req.params;
    const data = await validateUpdatePost(id, body);
    const post = await postsServices.updatePost(id, data);
    return res.status(200).send(post);
}

async function getPosts(req, res, next) {
    const { posts, total } = await postsServices.getListPosts(req.query);
    if (parseInt(req.query.is_all)) return res.status(200).send({ items: posts, total });
    return res.status(200).send({
        items: posts,
        total
    });
}

async function getPost(req, res, next) {
    const { id } = req.params;
    const post = await validatePost(id);
    return res.status(200).send(post);
}

async function deletePost(req, res, next) {
    const { id } = req.params;
    await validatePost(id);
    await postsServices.deletePost(id);
    return res.status(204).send();
}

async function likePost(req, res, next) {
    const { id } = req.params;
    await validateLikePost(id, req.body);
    const post = await postsServices.likePost(id, req.body);
    return res.status(200).send(post);
}

async function unlikePost(req, res, next) {
    const { id } = req.params;
    await validateUnLikePost(id, req.body);
    const post = await postsServices.unlikePost(id, req.body);
    return res.status(200).send(post);
}

async function getTimelineByUserId(req, res, next) {
    const { userId } = req.query;
    const user = await validateUser(userId);
    req.body.user = user;
    const posts = await postsServices.getTimelineByUserId(userId);
    return res.status(200).send(posts);
}

module.exports = {
    createPost,
    updatePost,
    getPosts,
    getPost,
    deletePost,
    likePost,
    unlikePost,
    getTimelineByUserId
};

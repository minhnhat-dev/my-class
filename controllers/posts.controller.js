/* eslint-disable radix */
const {
    validateCreatePost,
    validateUpdatePost,
    validatePost,
    validateLikePost
} = require('../validators/posts.validator');
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

module.exports = {
    createPost,
    updatePost,
    getPosts,
    getPost,
    deletePost,
    likePost
};

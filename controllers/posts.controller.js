/* eslint-disable radix */
const fs = require("fs");
const path = require("path");

const {
    validateCreatePost,
    validateUpdatePost,
    validatePost,
    validateLikePost,
    validateUnLikePost
} = require("../validators/posts.validator");
const { validateUser } = require("../validators/users.validator");
const { postsServices } = require("../services");
const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");

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
        skip: req.query.skip || SKIP_DEFAULT,
        limit: req.query.limit || LIMIT_DEFAULT,
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
    const { posts, total } = await postsServices.getTimelineByUserId(req.query);
    return res.status(200).send({
        skip: req.query.skip || SKIP_DEFAULT,
        limit: req.query.limit || LIMIT_DEFAULT,
        items: posts,
        total
    });
}

async function checkIsLike(req, res, next) {
    const { id } = req.params;
    const { userId } = req.query;
    await validatePost(id);
    const isLike = await postsServices.checkIsLikePost(id, userId);
    return res.status(200).send({ isLike });
}

function uploadImage(req, res) {
    return res.status(201).send({ file: req.file });
}

async function deleteImage(req, res) {
    const { file } = req.body;
    const { path: pathFile } = file;
    const pathDelete = path.resolve(pathFile);

    if (pathDelete) {
        await fs.unlinkSync(pathDelete);
    }

    return res.status(204).send();
}

async function getImagesUpload(req, res) {
    const pathFile = path.resolve("public/storage/images");
    const files = [];
    fs.readdirSync(pathFile).forEach((file) => {
        files.push(file);
    });
    return res.status(200).send({ items: files });
}

module.exports = {
    createPost,
    updatePost,
    getPosts,
    getPost,
    deletePost,
    likePost,
    unlikePost,
    getTimelineByUserId,
    checkIsLike,
    uploadImage,
    deleteImage,
    getImagesUpload
};

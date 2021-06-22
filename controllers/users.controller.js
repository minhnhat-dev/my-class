/* eslint-disable radix */
const { signAccessToken } = require("../middlewares/authentication");
const {
    validateCreateUser,
    validateUserLogin,
    validateUser,
    validateUpdateUser,
    validateFollowUser,
    validateUnFollowUser
} = require("../validators/users.validator");
const { usersServices } = require("../services");
const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");

async function createUser(req, res, next) {
    const { body } = req;
    const data = await validateCreateUser(body);
    const user = await usersServices.createUser(data);
    const token = signAccessToken(user);
    /* add infomation user to redis */
    req.session.user = user;
    return res.status(201).send({ user, token });
}

async function updateUser(req, res, next) {
    const { body } = req;
    const { id } = req.params;
    const data = await validateUpdateUser(id, body);
    const user = await usersServices.updateUser(id, data);
    /* add infomation user to redis */
    req.session.user = user;
    return res.status(200).send(user);
}

async function getUsers(req, res, next) {
    const { users, total } = await usersServices.getListUsers(req.query);
    if (parseInt(req.query.is_all)) return res.status(200).send({ items: users, total });
    return res.status(200).send({
        items: users,
        total
    });
}

async function login(req, res, next) {
    const { user, token } = await validateUserLogin(req.body);
    /* add infomation user to redis */
    req.session.user = user;
    return res.status(200).send({ user, token });
}

async function getUser(req, res, next) {
    const { id } = req.params;
    const user = await validateUser(id);
    return res.status(200).send(user);
}

async function deleteUser(req, res, next) {
    const { id } = req.params;
    const user = await validateUser(id);
    return res.status(200).send(user);
}

async function followUser(req, res, next) {
    const data = await validateFollowUser(req.body);
    const user = await usersServices.handleFollow(data);
    return res.status(200).send(user);
}

async function unfollowUser(req, res, next) {
    const data = await validateUnFollowUser(req.body);
    const user = await usersServices.handleUnFollow(data);
    return res.status(200).send(user);
}

async function getFollowers(req, res, next) {
    const { followers, total } = await usersServices.getFollowers(req.query);
    return res.status(200).send({
        skip: req.query.skip || SKIP_DEFAULT,
        limit: req.query.limit || LIMIT_DEFAULT,
        items: followers,
        total
    });
}

async function getFollowings(req, res, next) {
    const { followings, total } = await usersServices.getFollowings(req.query);
    return res.status(200).send({
        skip: req.query.skip || SKIP_DEFAULT,
        limit: req.query.limit || LIMIT_DEFAULT,
        items: followings,
        total
    });
}

module.exports = {
    createUser,
    updateUser,
    getUser,
    getUsers,
    login,
    deleteUser,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowings
};

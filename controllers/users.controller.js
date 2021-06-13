/* eslint-disable radix */
const { functions } = require("lodash");
const { validateBody } = require("../validators");
const { Users } = require("../datasources/mongodb/models");
const {
    validateCreateUser,
    validateUserLogin,
    validateUser,
    validateUpdateUser,
    validateFollowUser,
    validateUnFollowUser
} = require("../validators/users.validator");
const { usersServices } = require("../services");

async function createUser(req, res, next) {
    const { body } = req;
    const data = await validateCreateUser(body);
    const user = await usersServices.createUser(data);
    /* add infomation user to redis */
    req.session.user = user;
    return res.status(201).send(user);
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
    user.token = token;
    return res.status(200).send(user);
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
    const { id } = req.params;
    const data = await validateFollowUser(id, req.body);
    const user = await usersServices.handleFollow(id, data);
    return res.status(200).send(user);
}

async function unfollowUser(req, res, next) {
    const { id } = req.params;
    const data = await validateUnFollowUser(id, req.body);
    const user = await usersServices.handleUnFollow(id, data);
    return res.status(200).send(user);
}

module.exports = {
    createUser,
    updateUser,
    getUser,
    getUsers,
    login,
    deleteUser,
    followUser,
    unfollowUser
};

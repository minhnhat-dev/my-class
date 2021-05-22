/* eslint-disable radix */
const { validateBody } = require('../validators');
const { Users } = require('../datasources/mongodb/models');
const { validateCreateUser } = require('../validators/users.validator');
const { usersServices } = require('../services');

async function createUser(req, res, next) {
    const { body } = req;
    const data = await validateCreateUser(body);
    const user = await usersServices.createUser(data);
    return res.status(201).send({ data: user });
}

function updateUser(params) {

}

function getUser(params) {

}

async function getUsers(req, res, next) {
    const { users, total } = await usersServices.getListUsers(req.query);
    if (parseInt(req.query.is_all)) return res.status(200).send({ items: users, total });
    return res.status(200).send({
        items: users,
        total
    });
}

module.exports = {
    createUser,
    updateUser,
    getUser,
    getUsers
};

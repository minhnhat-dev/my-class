/* eslint-disable radix */
const { Users } = require('../datasources/mongodb/models');
const { convertSelectQuery, buildSortStringToObject } = require('../helpers/query.helper');

async function createUser(data) {
    const user = new Users(data);
    user.setPassword(data.password);
    await user.save();
    return user;
}

async function getListUsers(query) {
    const {
        skip = 0,
        limit = 100,
        sort,
        select,
        search_text: searchText,
        is_all: isAll = 0
    } = query;

    const conditions = {};
    const selects = convertSelectQuery(select);
    const sortObject = buildSortStringToObject(sort);

    if (searchText) {
        conditions.$or = [
            { name: { $regex: searchText.trim(), $options: 'i' } },
            { email: { $regex: searchText.trim(), $options: 'i' } }
        ];
    }

    const [users = [], total = 0] = await Promise.all([
        Users
            .find(conditions)
            .sort(sortObject)
            .skip(parseInt(isAll) ? 0 : Number(skip))
            .limit(parseInt(isAll) ? 0 : Number(limit))
            .select(selects)
            .lean(),
        Users.countDocuments(conditions)
    ]);
    return { users, total };
}

async function getUser(id) {
    const user = await Users.findById(id).lean();
}
module.exports = {
    createUser,
    getListUsers,
    getUser
};

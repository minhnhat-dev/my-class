/* eslint-disable radix */
const { Users, Followers, Followings } = require('../datasources/mongodb/models');
const { findByIdAndUpdate } = require('../datasources/mongodb/models/Posts');
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

async function updateUser(id, data) {
    const userUpdated = await Users.findByIdAndUpdate(id, { $set: data }, { new: true });
    return userUpdated;
}

async function handleFollow(userId, data) {
    const { followerId } = data;
    /* create follower  */
    const follower = await Followers.create({ userId: followerId, followerId: userId });
    /* create following */
    const following = await Followings.create({ userId, followingId: followerId });

    /* update total follower &  following for user */
    const userFollowerUpdated = await Users.findByIdAndUpdate(
        userId,
        {
            $set: { $inc: { totalFollowings: 1 } }
        },
        { new: true }
    );

    const userFollowingUpdated = await Users.findByIdAndUpdate(
        followerId,
        {
            $set: { $inc: { totalFollowers: 1 } }
        },
        { new: true }
    );

    return userFollowerUpdated;
}

module.exports = {
    createUser,
    getListUsers,
    getUser,
    updateUser,
    handleFollow
};

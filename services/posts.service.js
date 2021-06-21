/* eslint-disable radix */
const _ = require("lodash");
const { Posts, Likes, Users, Followings } = require("../datasources/mongodb/models");
const { convertSelectQuery, buildSortStringToObject } = require("../helpers/query.helper");
const { STATUS: STATUS_FOLLOWINGS } = require("../constants/followings.constant");
const { STATUS: STATUS_POSTS } = require("../constants/posts.constant");
const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");

async function createPost(data) {
    const post = await Posts.create(data);
    return post;
}

async function getListPosts(query) {
    const {
        skip = SKIP_DEFAULT,
        limit = LIMIT_DEFAULT,
        sort,
        select,
        searchText,
        isAll = false,
        userId
    } = query;

    const conditions = {};
    const selects = convertSelectQuery(select);
    const sortObject = buildSortStringToObject(sort);

    if (searchText) {
        conditions.$or = [
            { description: { $regex: searchText.trim(), $options: "i" } }
        ];
    }

    if (userId) {
        conditions.userId = userId;
    }

    const [posts = [], total = 0] = await Promise.all([
        Posts.find(conditions)
            .sort(sortObject)
            .skip(isAll ? 0 : Number(skip))
            .limit(isAll ? 0 : Number(limit))
            .select(selects)
            .lean(),
        Posts.countDocuments(conditions)
    ]);

    const userIds = posts.map((post) => post.userId.toString());
    const users = await Users.find({ _id: { $in: userIds } }).lean();
    const usersKeyById = _.keyBy(users, "_id");

    const newPosts = posts.map((post) => {
        const { userId: userIdPost } = post;
        post.user = usersKeyById[userIdPost.toString()] || null;
        return post;
    });

    return { posts: newPosts, total };
}

async function getPost(id) {
    const post = await Posts.findById(id).lean();
    return post;
}

async function updatePost(id, data) {
    const postUpdated = await Posts.findByIdAndUpdate(id, data, { new: true });
    return postUpdated;
}

async function deletePost(id) {
    return Posts.deleteOne({ _id: id });
}

async function likePost(id, data) {
    const { userId } = data;
    await Likes.create({ userId, postId: id });
    return Posts.findByIdAndUpdate(id, { $inc: { totalLikes: 1 } }, { new: true });
}

async function unlikePost(id, data) {
    const { userId } = data;
    await Likes.deleteOne({ userId, postId: id });
    return Posts.findByIdAndUpdate(id, { $inc: { totalLikes: -1 } }, { new: true });
}

async function getTimelineByUserId(query) {
    const {
        sort,
        userId,
        limit = LIMIT_DEFAULT,
        skip = SKIP_DEFAULT
    } = query;

    const sortObject = buildSortStringToObject(sort);
    const followings = await Followings.find({ userId, status: STATUS_FOLLOWINGS.ACTIVE });
    const usersFollowingsIds = _.uniq(followings.map((item) => item.followingId.toString()));
    const usersIds = _.uniq([userId, ...usersFollowingsIds]);
    const condition = { userId: { $in: usersIds }, status: STATUS_POSTS.ACTIVE };

    const [posts = [], total = 0] = await Promise.all([
        Posts.find(condition).sort(sortObject)
            .skip(skip)
            .limit(limit)
            .lean(),
        Posts.countDocuments(condition)
    ]);

    return { posts, total };
}

async function checkIsLikePost(id, userId) {
    const count = await Likes.countDocuments({ userId, postId: id });
    return !!count;
}

module.exports = {
    createPost,
    getListPosts,
    getPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    getTimelineByUserId,
    checkIsLikePost
};

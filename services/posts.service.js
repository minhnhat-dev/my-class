/* eslint-disable radix */
const _ = require("lodash");
const { Posts, Likes, Users, Followings } = require("../datasources/mongodb/models");
const { convertSelectQuery, buildSortStringToObject } = require("../helpers/query.helper");
const { STATUS: STATUS_FOLLOWINGS } = require("../constants/followings.constant");
const { STATUS: STATUS_POSTS } = require("../constants/posts.constant");

async function createPost(data) {
    const post = await Posts.create(data);
    return post;
}

async function getListPosts(query) {
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
            { description: { $regex: searchText.trim(), $options: "i" } }
        ];
    }

    const [posts = [], total = 0] = await Promise.all([
        Posts.find(conditions)
            .sort(sortObject)
            .skip(parseInt(isAll) ? 0 : Number(skip))
            .limit(parseInt(isAll) ? 0 : Number(limit))
            .select(selects)
            .lean(),
        Posts.countDocuments(conditions)
    ]);
    return { posts, total };
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

async function getTimelineByUserId(userId) {
    const followings = await Followings.find({ userId, status: STATUS_FOLLOWINGS.ACTIVE });
    const usersFollowingsIds = _.uniq(followings.map((item) => item.followingId.toString()));
    const usersIds = _.uniq([userId, ...usersFollowingsIds]);

    const [users = [], posts = []] = await Promise.all([
        Users.find({ _id: { $in: usersIds } }).lean(),
        Posts.find({ userId: { $in: usersIds }, status: STATUS_POSTS.ACTIVE }).lean()
    ]);

    const usersKeyById = _.keyBy(users, "_id");

    const newPosts = posts.map((post) => {
        const { userId: userIdPost } = post;
        post.user = usersKeyById[userIdPost.toString()] || null;
        return post;
    });
    return newPosts;
}

module.exports = {
    createPost,
    getListPosts,
    getPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    getTimelineByUserId
};

/* eslint-disable radix */
const { Posts, Likes } = require('../datasources/mongodb/models');
const { convertSelectQuery, buildSortStringToObject } = require('../helpers/query.helper');

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
            { description: { $regex: searchText.trim(), $options: 'i' } }
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

module.exports = {
    createPost,
    getListPosts,
    getPost,
    updatePost,
    deletePost,
    likePost
};

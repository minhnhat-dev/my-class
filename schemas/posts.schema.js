const shared = require("./shared.schema");

const create = {
    type: "object",
    required: ["userId"],
    properties: {
        userId: shared.mongoObjectId,
        description: { type: "string" },
        image: { type: "object" }
    }
};

const update = {
    type: "object",
    required: ["userId"],
    properties: {
        userId: shared.mongoObjectId,
        description: { type: "string" }
    }
};

const getList = {
    type: "object",
    properties: {
        skip: shared.getListSkip,
        limit: shared.getListLimit,
        isAll: { type: "boolean", default: false },
        select: { type: "string" },
        sort: { type: "string" },
        searchText: { type: "string" },
        userId: shared.mongoObjectId
    }
};

const likePost = {
    type: "object",
    required: ["userId"],
    properties: {
        userId: shared.mongoObjectId
    }
};

const unlikePost = {
    type: "object",
    required: ["userId"],
    properties: {
        userId: shared.mongoObjectId
    }
};

const getTimeline = {
    type: "object",
    required: ["userId"],
    properties: {
        userId: shared.mongoObjectId
    }
};

module.exports = {
    create,
    update,
    getList,
    likePost,
    unlikePost,
    getTimeline
};

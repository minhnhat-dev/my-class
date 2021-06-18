const shared = require("./shared.schema");
const { RELATIONSHIP } = require("../constants/users.constant");

const create = {
    type: "object",
    required: [
        "name", "email", "password", "passwordConfirm"
    ],
    properties: {
        name: { type: "string" },
        email: { type: "string", format: "email" },
        password: { type: "string" },
        passwordConfirm: { type: "string" },
        from: { type: "string" },
        city: { type: "string" },
        description: { type: "string" }
    }
};

const update = {
    type: "object",
    required: [],
    properties: {
        name: { type: "string" },
        email: { type: "string", format: "email" },
        password: { type: "string" },
        passwordConfirm: { type: "string" },
        from: { type: "string" },
        city: { type: "string" },
        description: { type: "string" },
        relationship: { type: "number", enum: Object.values(RELATIONSHIP) }
    }
};

const getList = {
    type: "object",
    properties: {
        skip: shared.getListSkip,
        limit: shared.getListLimit,
        is_all: { type: "string" },
        select: { type: "string" },
        sort: { type: "string" },
        search_text: { type: "string" }
    }
};

const login = {
    type: "object",
    required: ["email", "password"],
    properties: {
        email: {
            type: "string",
            format: "email"
        },
        password: {
            type: "string"
        }
    }
};

const follow = {
    type: "object",
    properties: {
        userId: shared.mongoObjectId,
        followerId: shared.mongoObjectId
    }
};

const unFollow = {
    type: "object",
    properties: {
        userId: shared.mongoObjectId,
        unFollowerId: shared.mongoObjectId
    }
};

module.exports = {
    create,
    update,
    getList,
    login,
    follow,
    unFollow
};

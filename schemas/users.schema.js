const shared = require('./shared.schema');

const create = {
    type: 'object',
    required: [
        'name', 'email', 'password', 'passwordConfirm'
    ],
    properties: {
        name: {
            type: 'string'
        },
        email: {
            type: 'string',
            format: 'email'
        },
        password: {
            type: 'string'
        },
        passwordConfirm: {
            type: 'string'
        }
    }
};

const update = {
    type: 'object',
    required: [],
    properties: {
        name: {
            type: 'string'
        },
        email: {
            type: 'string',
            format: 'email'
        },
        password: {
            type: 'string'
        },
        passwordConfirm: {
            type: 'string'
        }
    }
};

const getList = {
    type: 'object',
    properties: {
        skip: shared.getListSkip,
        limit: shared.getListLimit,
        is_all: { type: 'string' },
        select: { type: 'string' },
        sort: { type: 'string' },
        search_text: { type: 'string' }
    }
};

const login = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {
            type: 'string',
            format: 'email'
        },
        password: {
            type: 'string'
        }
    }
};

module.exports = {
    create,
    update,
    getList,
    login
};

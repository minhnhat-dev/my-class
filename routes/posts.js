const express = require('express');
const _ = require('lodash');
const CreateError = require('http-errors');
const { verifyToken } = require('../middlewares/authentication');
const { validate } = require('../validator');
const { Posts } = require('../datasources/mongodb/models');
const { buildTextSearch } = require('../utils');
const Users = require('../datasources/mongodb/models/Users');

const router = express.Router();
require('express-async-errors');

router.use(verifyToken);

router.post('/', async (req, res) => {
    const { body } = req;
    validate('input-create-posts', body);
    const post = await Posts.create(body);
    return res.status(201).send({ data: post });
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    validate('input-update-posts', body);
    const post = await Posts.findOneAndUpdate({ _id: id }).lean();
    return res.status(201).send({ data: post });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const post = await Posts.findOne({ _id: id }).lean();
    return res.status(201).send({ data: post });
});

router.get('/', async (req, res) => {
    console.log('zo');
    const { text } = req.query;
    const query = _.omitBy({
        text: new RegExp(text, 'i')
    }, _.isNil);
    const [total, posts] = await Promise.all([
        Posts.countDocuments({}),
        Posts
            .find(query)
            .populate({
                path: 'user',
                select: 'name email'
            }).lean()
    ]);
    return res.status(200).send({ meta: { total }, data: posts });
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Posts.deleteOne({ _id: id });
    return res.status(204).send();
});

router.post('/:id/:action', async (req, res) => {
    const { user, text = '' } = req.body;
    const { action, id } = req.params;
    const [countPost, countUser] = await Promise.all([
        Posts.countDocuments({
            _id: id,
            totalLike: action === 'unlike' ? { $gt: 0 } : { $gte: 0 },
            totalComment: action === 'delete-comment' ? { $gt: 0 } : { $gte: 0 }
        }),
        Users.countDocuments({ _id: user })
    ]);

    if (!countPost) {
        throw new CreateError(
            404,
            'Post Not Found!',
            { details: [{ dataPath: '/id', message: 'Post Not Found!' }] }
        );
    }

    if (!countUser) {
        throw new CreateError(
            404,
            'User Not Found!',
            { details: [{ dataPath: '/user', message: 'User Not Found!' }] }
        );
    }

    const dataUpdate = {};
    // handle for like
    if (action === 'like') {
        dataUpdate.$inc = { totalLike: 1 };
        dataUpdate.$addToSet = { likes: { user } };
    }

    if (action === 'unlike') {
        dataUpdate.$inc = { totalLike: -1 };
        dataUpdate.$pull = { likes: { user } };
    }
    // handle for comment
    if (action === 'comment') {
        dataUpdate.$inc = { totalComment: 1 };
        dataUpdate.$addToSet = { comments: { user, text, createdAt: new Date() } };
    }

    if (action === 'delete-comment') {
        dataUpdate.$inc = { totalComment: -1 };
        dataUpdate.$pull = { comments: { user } };
    }

    const post = await Posts.findOneAndUpdate({ _id: id }, dataUpdate, { new: true }).lean();
    return res.status(200).send({ data: post });
});

module.exports = router;

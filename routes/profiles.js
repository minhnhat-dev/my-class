const CreateError = require('http-errors');
const express = require('express');
require('express-async-errors');

const _ = require('lodash');
const { Users, Profiles } = require('../datasources/mongodb/models');
const { signAccessToken } = require('../middlewares/authentication');

const { validate } = require('../validators');

const router = express.Router();

router.get('/', async (req, res) => {
    const { name, school, skills = [], location, limit = 20, skip = 0 } = req.query;
    const query = _.omitBy({
        name,
        'education.school': school,
        location
    }, _.isNil);

    if (skills.length) {
        query.skills = { $in: skills };
    }

    const [total, profiles] = await Promise.all([
        Profiles.countDocuments({}),
        Profiles
            .find(query)
            .populate({ path: 'users', match: { name }, select: 'name' }).skip(skip).limit(limit)
            .lean()
    ]);

    return res.status(200).send({ meta: { total }, data: profiles });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const profile = await Profiles.findOneAndUpdate({ _id: id }).lean();
    return res.status(200).send({ data: profile });
});

router.post('/', async (req, res) => {
    const { body } = req;
    validate('input-create-profiles', body);
    const { user } = body;

    const [countProfile, countUser] = await Promise.all([
        Profiles.countDocuments({ user }),
        Users.countDocuments({ _id: user })
    ]);

    if (countProfile) {
        throw new CreateError(
            400,
            'Profile Already Exists!'
        );
    }

    if (!countUser) {
        throw new CreateError(
            404,
            'User Not Found!',
            { details: [{ dataPath: '/user', message: 'User Not Found!' }] }
        );
    }

    const profiles = await Profiles.create(_.omitBy(body, _.isNil));

    return res.status(201).send({ data: profiles });
});

router.put('/:id', async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    validate('input-update-profiles', body);

    const profile = await Profiles.findOne({ _id: id }).select('_id').lean();

    if (!profile) {
        throw new CreateError(
            404,
            'Profile Not Found!',
            { details: [{ dataPath: '/id', message: 'Profile Not Found!' }] }
        );
    }

    const profiles = await Profiles.findOneAndUpdate({ _id: id }, _.omitBy(body, _.isNil), { new: true });

    return res.status(200).send({ data: profiles });
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Profiles.deleteOne({ _id: id });
    return res.status(204);
});

module.exports = router;

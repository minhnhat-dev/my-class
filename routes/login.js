const CreateError = require('http-errors');
const express = require('express');
const { Users } = require('../datasources/mongodb/models');
const { signAccessToken, verifyToken } = require('../middlewares/authentication');
require('express-async-errors');
const { validate } = require('../validators');
const { userValidator } = require('../validators');
const { userConstant } = require('../constants');

const router = express.Router();

// @route    GET /authenticate
// @desc     Get user by token
// @access   Private
router.post('/login/:type', async (req, res) => {
    const { type } = req.params;
    let result = {};
    if (type === userConstant.TYPES.FACEBOOK) {
        result = await userValidator.validateAccessTokenFaceBook(req.body);
    }
    return res.status(200).send(result);
});

router.post('/register', async (req, res) => {
    console.log(1);
    const { body } = req;
    validate('input-create-users', body);

    // check gmail exist
    const { email, password } = body;
    console.log('email', email);
    const count = await Users.countDocuments({ email });
    console.log('count', count);
    if (count) {
        throw new CreateError(
            400,
            'Email already exists!',
            { details: [{ dataPath: '/email', message: 'Email already exists!' }] }
        );
    }
    const user = new Users(body);
    user.roles = ['Normal'];
    user.setPassword(password);
    const token = signAccessToken(user);
    await user.save();

    return res.status(200).send({ data: user, token });
});

router.post('/login', async (req, res) => {
    const { body } = req;
    validate('input-login', body);
    const { email, password } = body;
    const user = await Users.findOne({ email, status: 'active' }).select('hash salt');
    if (!user) {
        throw new CreateError.NotFound('User Not Found!');
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
        throw new CreateError.NotFound(
            'User Not Found!',
            { details: [{ dataPath: '/password', message: 'Password not correct!' }] }
        );
    }

    return res.status(200).send({
        token: signAccessToken(user),
        message: 'Login Success!'
    });
});
module.exports = router;

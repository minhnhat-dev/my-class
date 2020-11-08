const CreateError = require('http-errors');
const express = require('express');
const { Users } = require('../datasources/mongodb/models');
const { signAccessToken } = require('../middlewares/authentication');
require('express-async-errors');
const { validate } = require('../validator');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { body } = req;
  validate('input-create-users', body);

  // check gmail exist
  const { email, password } = body;
  const count = await Users.countDocuments({ email });
  if (count) {
    throw new CreateError(
      400,
      'Email already exists!',
      { details: [{ dataPath: '/email', message: 'Email already exists!' }] },
    );
  }
  const user = new Users(body);
  user.role = 'Admin';
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
      { details: [{ dataPath: '/password', message: 'Password not correct!' }] },
    );
  }

  return res.status(200).send({
    token: signAccessToken(user),
    message: 'Login Success!',
  });
});
module.exports = router;

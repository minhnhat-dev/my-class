const express = require('express');
const users = require('./user');
const login = require('./login');
const posts = require('./posts');
const profiles = require('./profiles');

const router = express.Router();

router.use('/', login);
router.use('/users', users);

router.use('/posts', posts);
router.use('/profiles', profiles);

module.exports = router;

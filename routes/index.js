const express = require('express');
const user = require('./user');
const login = require('./login');

const router = express.Router();

router.use('/', login);
router.use('/users', user);

module.exports = router;

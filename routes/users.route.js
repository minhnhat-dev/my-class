const express = require('express');

const router = express.Router();
const { verifySession } = require('../middlewares/authentication');
const { validateBody, validateQuery } = require('../validators');
const { usersControllers } = require('../controllers');
const { usersSchema } = require('../schemas');
require('express-async-errors');

// router.use(verifyToken);

router.post('/', validateBody(usersSchema.create), usersControllers.createUser);
router.get('/', verifySession, validateQuery(usersSchema.getList), usersControllers.getUsers);
router.post('/login', validateBody(usersSchema.login), usersControllers.login);

module.exports = router;

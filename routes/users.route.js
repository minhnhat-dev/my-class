const express = require('express');

const router = express.Router();
const { verifyToken } = require('../middlewares/authentication');
const { validateBody, validateQuery } = require('../validators');
const { usersControllers } = require('../controllers');
const { usersSchema } = require('../schemas');
require('express-async-errors');

// router.use(verifyToken);

router.post('/', validateBody(usersSchema.create), usersControllers.createUser);
router.get('/', validateQuery(usersSchema.getList), usersControllers.getUsers);

module.exports = router;

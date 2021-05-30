const express = require('express');

const router = express.Router();
const { verifySession } = require('../middlewares/authentication');
const { validateBody, validateQuery } = require('../validators');
const { postsControllers } = require('../controllers');
const { postsSchema } = require('../schemas');
require('express-async-errors');

// router.use(verifyToken);
router.get('/', validateQuery(postsSchema.getList), postsControllers.getPosts);
router.post('/', validateBody(postsSchema.create), postsControllers.createPost);
router.get('/:id', validateBody(postsSchema.update), postsControllers.getPost);
router.put('/:id', validateBody(postsSchema.update), postsControllers.updatePost);
router.put('/:id/like', validateBody(postsSchema.likePost), postsControllers.likePost);
router.put('/:id/unlike', validateBody(postsSchema.update), postsControllers.updatePost);
router.delete('/:id', postsControllers.deletePost);

module.exports = router;

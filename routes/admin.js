// const express = require('express');

// const router = express.Router();
// const path = require('path');
// const uploadBus = require('../middlewares/upload-files');
// const PostsModel = require('../models/posts.model');

// router.get('/', (req, res) => {
//   res.render(path.resolve('./views/blog/admin/index.admin.ejs'));
// });

// router.get('/posts', (req, res) => {
//   res.render(path.resolve('./views/blog/admin/admin.posts.ejs'));
// });

// router.post('/posts', async (req, res) => {
//   try {
//     let data = req.body || {};
//     const files = await uploadBus.upload('create-posts', req, res);
//     console.log('files', files);
//     data.image = files && files.image || [];
//     data = validate('input-create-post', data);
//     const post = await PostsModel.create(data);
//     res.render(path.resolve('./views/blog/admin/admin.posts.ejs'), { post });
//   } catch (error) {
//     console.log('error', error);
//     res.render(path.resolve('./views/blog/admin/admin.posts.ejs'));
//   }
// });

// module.exports = router;

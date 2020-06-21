const express = require('express');
const userRoute = require('./user.route');
const postRoute = require('./posts.route');
const adminRoute = require('./admin.route');
const router = express.Router();

router.use('/admin', adminRoute);
router.use('/users', userRoute);
router.use('/blog', postRoute);

module.exports = router;

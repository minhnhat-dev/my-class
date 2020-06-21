const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', function (req, res) {
  res.render(path.resolve('./views/blog/index.blog.ejs'));
});

router.get('/detail', function (req, res) {
  res.render(path.resolve('./views/blog/details.blog.ejs'));
});

module.exports = router;
const express = require('express');
const router = express.Router();
const path = require('path');
const {ProductController} = require(path.resolve('./controllers'));

router.get('/', ProductController.list);
router.post('/', ProductController.create);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.deleteById);

export default router;
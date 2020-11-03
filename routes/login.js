const createError = require('http-errors');
const express = require('express');

// require('express-async-errors');
const { validate } = require('../validator');

const router = express.Router();

router.post('/register', (req, res) => {
  const { body } = req;
  const resultValidate = validate('input-create-users', body);
  console.log('resultValidate', resultValidate);
  if (!resultValidate) {
    throw new createError.BadRequest('Invalid Input Create Users');
  }
  res.status(200).send(body);
});

module.exports = router;

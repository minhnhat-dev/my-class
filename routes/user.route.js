const express = require('express');
const router = express.Router();
const User = require('../models/users.model');
const InitRoutes = require('../helpers/init-routes-schema-model');

try{
	InitRoutes(router, User);
} catch (error) {
	throw error;
}
module.exports = router;

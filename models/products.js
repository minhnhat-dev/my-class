'use strict';
const Authentication = require('../middlewares/authention');
const {validate} = require('../validator');
const ProductsModel = require('../models/products.model');
const Products = {};
const path = require('path');
const authentication = new Authentication();
/**
	 * Register
	 *
	 * @param      {<type>}  req   The req
	 * @param      {<type>}  res   The res
	 * @return     {<type>}  The access token.
	 */
Products.getProducts = async function (req, res) {
	try {
		const products = await ProductsModel.find({});
		res.status(200).send({products});
	} catch (error) {
		throw error;
	}
};

/**
 * Create new post
 *
 * @param      {<type>}  req   The req
 * @param      {<type>}  res   The res
 * @return     {<type>}  The access token.
 */
Products.create = async function (req, res) {
  try {
    console.log('req.body', req.body);
    res.render(path.resolve('./views/blog/index.blog.ejs'));
  } catch (error) {
    throw error;
  }
};


module.exports = User;
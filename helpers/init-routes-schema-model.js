const Authentication = require('../middlewares/authention');

const authentication = new Authentication();

module.exports = function (router, Model) {
	/* get acls */
	let acls = Model.acls || [];
	const name = Model.collection.collectionName;
	const pathMethods = `../models/${name}.js`;
	const methods = require(pathMethods);
	if(!acls.length) return;
	acls.forEach(item => {
		let {path, verb, roles, method, authenticated} = item;
		let middlewares = [];

		if(authenticated) {
			middlewares.push(authentication.verifyToken);
		}

		if(roles && roles.length) {
			middlewares.push(authentication.verifyRoles(roles));
		}

		if(method) {
			middlewares.push(methods[method]);
		}
		router[verb](path, middlewares);
	});
};

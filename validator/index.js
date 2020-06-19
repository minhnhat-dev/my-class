'use strict';

const Ajv = require('ajv');
const schemas = require('./schemas');
const createError = require('http-errors');
const ajv = new Ajv({allErrors: true, useDefaults: true,});

/**
 * Validate password
 */
const _validatePassword = password => {
	const strongRegex = new RegExp(
		'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
	);
	return strongRegex.test(password);
};


ajv.addSchema(schemas);
/* add validate password */
ajv.addKeyword('passwordChecker', {
	modifying: false,
	schema: false,
	errors: true,
	validate: function passwordChecker(
		data,
		dataPath,
		parentData,
		parentDataProperty
	) {
		if (
			typeof data === 'string' &&
			parentData &&
			!_validatePassword(data)
		) {
			passwordChecker.errors = [];
			passwordChecker.errors.push({
				keyword: 'passwordChecker',
				message: 'Password not strong: ' + data,
				params: {
					passwordChecker: parentDataProperty,
				},
			});
			return false;
		}
		return true;
	},
});

/**
 * Validate schemas
 */
function validate(name, data){
	const validate = ajv.getSchema(name + '.json');
	const valid = validate(data);
	const newError = new createError.BadRequest('Validation failed');
	newError.code = 'INVALID_PARAMETERS';
	newError.details = validate.errors;
	if (!valid) {
		throw newError;
	}
	return data;
}

module.exports = {
	validate,
};


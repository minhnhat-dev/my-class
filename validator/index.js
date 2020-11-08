const Ajv = require('ajv');
const createError = require('http-errors');
const schemas = require('./schemas');

const ajv = new Ajv({ allErrors: true, useDefaults: true });
require('ajv-errors')(ajv /* , {singleError: true} */);
/**
 * Validate password
 */
const _validatePassword = (password) => {
  const strongRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
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
    parentDataProperty,
  ) {
    if (
      typeof data === 'string' && parentData && !_validatePassword(data)
    ) {
      passwordChecker.errors = [];
      passwordChecker.errors.push({
        keyword: 'passwordChecker',
        message: `Password not strong: ${data}`,
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
 * @goal  validate input data with AJV Schema
 * @name {string} Name id in file .json in directory schemas
 * @data {object} The data input
 * @return {object} The data is valid
 */
function validate(name, data) {
  console.log('name', name);
  const validator = ajv.getSchema(`${name}.json`);
  console.log('validator', validator);
  const valid = validator(data);
  const newError = new createError.BadRequest('Validation failed');
  newError.code = 'INVALID_PARAMETERS';
  newError.details = validator.errors;
  if (!valid) {
    throw newError;
  }
  return data;
}

module.exports = {
  validate,
};

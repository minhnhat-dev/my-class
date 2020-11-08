const CreateError = require('http-errors');

function createError(params) {
  const { status, code, message, details = [] } = params;
  throw new CreateError(status, message, details);
}

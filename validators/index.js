const Ajv = require("ajv");
const createError = require("http-errors");
const schemas = require("./schemas");
const userValidator = require("./users.validator");

const ajv = new Ajv({
    allErrors: true,
    useDefaults: true,
    removeAdditional: true,
    async: true,
    jsonPointers: true,
    passContext: true,
    coerceTypes: true
});
require("ajv-errors")(ajv);
require("ajv-bsontype")(ajv);
/**
 * Validate password
 */
const _validatePassword = (password) => {
    const strongRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    return strongRegex.test(password);
};
ajv.addSchema(schemas);
/* add validate password */
ajv.addKeyword("passwordChecker", {
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
            typeof data === "string" && parentData && !_validatePassword(data)
        ) {
            passwordChecker.errors = [];
            passwordChecker.errors.push({
                keyword: "passwordChecker",
                message: `Password not strong: ${data}`,
                params: {
                    passwordChecker: parentDataProperty
                }
            });
            return false;
        }
        return true;
    }
});

/**
 * @goal  validate input data with AJV Schema
 * @name {string} Name id in file .json in directory schemas
 * @data {object} The data input
 * @return {object} The data is valid
 */
function validate(name, data) {
    const validator = ajv.getSchema(`${name}.json`);
    const valid = validator(data);
    const newError = new createError.BadRequest("Validation failed");
    newError.code = "INVALID_PARAMETERS";
    newError.details = validator.errors;
    if (!valid) {
        throw newError;
    }
    return data;
}

function generateErrorMessage(error) {
    switch (error.keyword) {
    case "required":
        return `error_${error.params.missingProperty}_is_required`;

    case "db_exists": {
        const paths = error.dataPath.split("/");
        const field = paths.splice(-1);
        return `error_${field}_notfound`;
    }

    case "db_unique": {
        const paths = error.dataPath.split("/");
        const field = paths.splice(-1);
        return `error_${field}_existed`;
    }

    default: {
        if (error.dataPath) {
            const paths = error.dataPath.split("/");
            if (paths.length > 0) {
                const field = paths.splice(-1);
                return `error_${field}_invalid`;
            }
        }

        return error.message;
    }
    }
}

function validateSchema(schema, path = "body") {
    schema.$async = true;
    return async function (req, res, next) {
        try {
            await ajv.validate(schema, req[path]);
            next();
        } catch (err) {
            if (!(err instanceof Ajv.ValidationError)) { throw createError.InternalServerError(err.message); }

            const msgs = err.errors.map(generateErrorMessage);
            throw createError.UnprocessableEntity(msgs);
        }
    };
}

function validateBody(schema) {
    return validateSchema(schema, "body");
}

function validateQuery(schema) {
    return validateSchema(schema, "query");
}

function validateParams(schema) {
    return validateSchema(schema, "params");
}

module.exports = {
    validate,
    userValidator,
    validateBody,
    validateQuery,
    validateParams
};

/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
const mung = require('express-mung');

/* Remove any classified information from the response. */
function redact(body, req, res) {
    const bodyNormalized = normalizeMongooseObject(body);
    return bodyNormalized;
}

function normalizeMongooseObject(_object) {
    if (!_object) return _object;

    let object;
    if (typeof _object.toJSON === 'function') {
        object = _object.toJSON();
    } else {
        object = _object;
    }

    if (object instanceof Array) {
        for (let index = 0; index < object.length; index++) {
            const element = object[index];
            object[index] = normalizeMongooseObject(element);
        }
    } else {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const value = object[key];

                if (key === '_id') {
                    object.id = object._id;
                    delete object._id;
                    if (typeof object.id === 'object') {
                        object.id = object.id.toString();
                    }
                } else if (key === '__v') {
                    delete object.__v;
                } else if (value && value instanceof Object && !(value instanceof Array)) {
                    object[key] = normalizeMongooseObject(value);
                } else if (value && value instanceof Array) {
                    for (let index = 0; index < value.length; index++) {
                        const element = value[index];
                        value[index] = normalizeMongooseObject(element);
                    }
                }
            }
        }
    }

    return object;
}

module.exports = mung.json(redact);

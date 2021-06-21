const createError = require("http-errors");
const { uploadFiles } = require("../configs");

function addConfigUploadFiles(key) {
    const config = uploadFiles[key];

    if (!config) {
        throw new createError.BadRequest("error_key_upload_invalid");
    }

    return (req, res, next) => {
        req.config = config;
        return next();
    };
}

module.exports = {
    addConfigUploadFiles
};

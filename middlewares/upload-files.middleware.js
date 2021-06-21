const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const dest = path.join(path.resolve("./public/storage/images"));

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        cb(null, dest);
    },
    filename(req, file, cb) {
        crypto.pseudoRandomBytes(16, (err, raw) => {
            cb(null, `${raw.toString("hex") + Date.now()}.${file.originalname}`);
        });
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 2388608
    }
});

module.exports = upload;

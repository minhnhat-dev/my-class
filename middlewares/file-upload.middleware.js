// uploadMiddleware.js
const multer = require("multer");

function uploadFile(req, res, next) {
    const upload = multer({ limits: { fileSize: 4 * 1024 * 1024 } }).array("images", 4);

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({});
        } if (err) {
            return res.status(400).json({ message: "Errror" });
        }
        if (req.body.is_upload_images && req.body.is_upload_images == "on" && !req.files) {
            return res.status(401).json({ error: "Vui lòng tải lên 1 hình ảnh!" });
        }
        //
        // if(!req.body.is_upload_images && !req.files){
        //   return res.status(401).json({error: 'Có lỗi xảy ra!'});
        // }
        next();
    });
}

module.exports = uploadFile;

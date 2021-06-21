const express = require("express");

const router = express.Router();
const { verifyToken } = require("../middlewares/authentication");
const { validateBody, validateQuery } = require("../validators");
const { postsControllers } = require("../controllers");
const { postsSchema } = require("../schemas");
const upload = require("../middlewares/upload-files.middleware");
require("express-async-errors");

router.use(verifyToken);
router.get("/", validateQuery(postsSchema.getList), postsControllers.getPosts);
router.post("/", validateBody(postsSchema.create), postsControllers.createPost);
router.get("/upload/", postsControllers.getImagesUpload);
router.post("/upload", upload.single("image"), postsControllers.uploadImage);
router.get("/timeline/", validateQuery(postsSchema.getTimeline), postsControllers.getTimelineByUserId);
router.get("/:id", validateBody(postsSchema.update), postsControllers.getPost);
router.put("/:id", validateBody(postsSchema.update), postsControllers.updatePost);
router.get("/:id/is-like", postsControllers.checkIsLike);
router.put("/:id/like", validateBody(postsSchema.likePost), postsControllers.likePost);
router.put("/:id/unlike", validateBody(postsSchema.unlikePost), postsControllers.unlikePost);
router.delete("/upload/", postsControllers.deleteImage);
router.delete("/:id", postsControllers.deletePost);

module.exports = router;

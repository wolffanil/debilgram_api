const express = require("express");
const {
  uploadPhoto,
  resizeProfilePhoto,
  deleteProfilePhoto,
  resizeBackgroundPhoto,
  deleteBackgroundPhoto,
} = require("../controllers/photoController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/uploadProfilePhoto", uploadPhoto, resizeProfilePhoto);
router.post("/uploadBgPhoto", uploadPhoto, resizeBackgroundPhoto);

router.delete("/deleteProfilePhoto/:photoId", deleteProfilePhoto);
router.delete("/deleteBgPhoto/:photoId", deleteBackgroundPhoto);

module.exports = router;

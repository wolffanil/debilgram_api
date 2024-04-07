const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;
const catchAsync = require("../utils/catchAsync");
const { v4: uuidv4 } = require("uuid");

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
});

exports.uploadPhoto = upload.single("image");

exports.resizeProfilePhoto = catchAsync(async (req, res) => {
  if (!req.file)
    return res.status(400).json({
      status: "error",
      message: "The file not exist",
    });

  req.file.filename = `profile-${uuidv4()}.png`;

  await sharp(req.file.buffer)
    .toFormat("png")
    .jpeg({ quality: 90 })
    .toFile(`upload/profile/${req.file.filename}`);

  res.status(200).json({
    status: "seccess",
    imageUrl: `${process.env.SERVER_URL}/upload/profile/${req.file.filename}`,
  });
});

exports.deleteProfilePhoto = catchAsync(async (req, res) => {
  const photoId = req.params.photoId;

  const filePath = path.join(__dirname, "../upload/profile", photoId);

  await fs.unlink(filePath);
  res.status(200).json({
    status: "seccess",
  });
});

exports.resizeBackgroundPhoto = catchAsync(async (req, res) => {
  if (!req.file)
    return res.status(400).json({
      status: "error",
      message: "The file not exist",
    });

  req.file.filename = `background-${uuidv4()}.png`;

  await sharp(req.file.buffer)
    .toFormat("png")
    .jpeg({ quality: 90 })
    .toFile(`upload/background/${req.file.filename}`);

  res.status(200).json({
    status: "seccess",
    imageUrl: `${process.env.SERVER_URL}/upload/background/${req.file.filename}`,
  });
});

exports.deleteBackgroundPhoto = catchAsync(async (req, res) => {
  const photoId = req.params.photoId;

  const filePath = path.join(__dirname, "../upload/background", photoId);

  await fs.unlink(filePath);
  res.status(200).json({
    status: "seccess",
  });
});

const express = require("express");
const {
  getAllMessages,
  createNewMessage,
} = require("../controllers/messageController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/:chatId").get(getAllMessages);

router.route("/").post(createNewMessage);
module.exports = router;

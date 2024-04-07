const express = require("express");

const protect = require("../middlewares/authMiddleware");
const {
  getMyChats,
  accessChat,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  changeDataGroup,
} = require("../controllers/chatContoller");

const router = express.Router();

router.use(protect);

router.route("/group").post(createGroupChat);
router.route("/groupremove").patch(removeFromGroup);
router.route("/groupadd").patch(addToGroup);
router.route("/:chatId").patch(changeDataGroup);
router.route("/").get(getMyChats).post(accessChat);

module.exports = router;

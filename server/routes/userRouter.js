const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  getUserById,
  getMyTokens,
  updateMyProfile,
  deleteToken,
} = require("../controllers/userController");

const router = express.Router();

router.use(protect);

// router.get("/my-tokens", getMyTokens);
// router.get("/:id", getUserById);
// router.patch("/updateMyProfile", updateMyProfile);
// router.delete("/deleteMyToken/:id", deleteToken);
// router.get("/", getAllUsers);

router.route("/my-tokens").get(getMyTokens);
router.route("/:id").get(getUserById);
router.route("/updateMyProfile").patch(updateMyProfile);
router.route("/deleteMyToken/:id").delete(deleteToken);
router.route("/").get(getAllUsers);

module.exports = router;

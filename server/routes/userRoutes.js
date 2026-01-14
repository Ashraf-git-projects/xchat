const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  searchUsers,
  logoutUser
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/search", protect, searchUsers);
router.get("/logout", protect, logoutUser);


module.exports = router;

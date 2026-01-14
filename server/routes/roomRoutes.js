const express = require("express");
const { initRoom, getUserRooms } = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/init", protect, initRoom);
router.get("/userrooms", protect, getUserRooms);

module.exports = router;

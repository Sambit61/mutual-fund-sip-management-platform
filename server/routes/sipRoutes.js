const express = require("express");
const { createSIP } = require("../controllers/sipController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createSIP);

module.exports = router;
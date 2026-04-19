const express = require("express");
const { createFund, getFunds } = require("../controllers/fundController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createFund);
router.get("/", (req, res, next) => {
  console.log("fundRoute GET / hit");
  next();
}, getFunds);

module.exports = router;
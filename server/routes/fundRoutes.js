const express = require("express");

const {
  createFund,
  getFunds,
  deleteFund,
  updateFund
} = require("../controllers/fundController");

const {
  protect
} = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ✅ CREATE FUND

router.post(
  "/",
  protect,
  adminMiddleware,
  createFund
);

// ✅ DELETE FUND

router.delete(
  "/:id",
  protect,
  adminMiddleware,
  deleteFund
);

// ✅ UPDATE FUND

router.put(
  "/:id",
  protect,
  adminMiddleware,
  updateFund
);

// ✅ GET ALL FUNDS

router.get(
  "/",
  (req, res, next) => {
    console.log("fundRoute GET / hit");
    next();
  },
  getFunds
);

module.exports = router;
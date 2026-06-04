const express = require("express");

const {
  getAdminStats,
  getAllTransactions,
  getAllUsers,
  makeAdmin
} = require("../controllers/adminController");

const {
  protect
} = require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

const router = express.Router();

// ✅ ADMIN STATS ROUTE

router.get(
  "/stats",
  protect,
  adminMiddleware,
  getAdminStats
);

// ✅ ALL TRANSACTIONS ROUTE

router.get(
  "/transactions",
  protect,
  adminMiddleware,
  getAllTransactions
);

// ✅ ALL USERS ROUTE

router.get(
  "/users",
  protect,
  adminMiddleware,
  getAllUsers
);

// ✅ MAKE ADMIN ROUTE

router.put(
  "/make-admin/:id",
  protect,
  adminMiddleware,
  makeAdmin
);

module.exports = router;
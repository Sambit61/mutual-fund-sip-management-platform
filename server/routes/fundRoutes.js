const express = require("express");

const {
  createFund,
  getFunds,
  deleteFund,
  updateFund,
  syncFundNav,
  syncAllFundNavs,
  searchFunds,
  importFund,
  getTopFunds
} = require("../controllers/fundController");

const {
  protect
} = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
  "/search",
  protect,
  adminMiddleware,
  searchFunds
);

router.get(
  "/top-funds",
  getTopFunds
);
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

router.post(
  "/sync/:id",
  protect,
  adminMiddleware,
  syncFundNav
);
router.post(
  "/sync-all",
  protect,
  adminMiddleware,
  syncAllFundNavs
);

//import
router.post(
  "/import",
  protect,
  adminMiddleware,
  importFund
);


module.exports = router;
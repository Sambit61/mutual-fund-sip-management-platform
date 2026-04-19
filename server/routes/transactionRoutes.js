const express = require("express");
const { buyAsset,redeemFund, getMyTransactions,getPortfolio } = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/buy", protect, buyAsset);
router.post("/redeem", protect, redeemFund);
router.get("/my",protect,getMyTransactions);
router.get("/portfolio",protect,getPortfolio);


module.exports = router;
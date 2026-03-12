const express = require("express");
const { buyFund,redeemFund, getMyTransactions,getPortfolio } = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/buy", protect, buyFund);
router.post("/redeem", protect, redeemFund);
router.get("/my",protect,getMyTransactions);
router.get("/portfolio",protect,getPortfolio);


module.exports = router;
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({

  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  fund: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MutualFund",
    default: null
  },

  // 🔹 NEW (for stocks)
  symbol: {
    type: String,
    default: null
  },

  amount: Number,
  nav: Number,     // for funds OR stock price
  units: Number,

  type: {
    type: String,
    enum: ["BUY", "SELL"],
    default: "BUY"
  },

  assetType: {
    type: String,
    enum: ["FUND", "STOCK"],
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
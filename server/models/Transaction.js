const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
{
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fund: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MutualFund",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  nav: {
    type: Number,
    required: true
  },
  units: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["BUY", "REDEEM"],
    default: "BUY"
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
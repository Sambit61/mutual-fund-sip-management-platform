const mongoose = require("mongoose");

const sipSchema = new mongoose.Schema(
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
  frequency: {
    type: String,
    enum: ["MONTHLY"],
    default: "MONTHLY"
  },
  startDate: {
    type: Date,
    required: true
  },
  nextRun: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["ACTIVE","PAUSED"],
    default: "ACTIVE"
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("SIP", sipSchema);
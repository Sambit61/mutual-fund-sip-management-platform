const mongoose = require("mongoose");

const mutualFundSchema = new mongoose.Schema({
  fundName: {
    type: String,
    required: true
  },
  fundCode: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String
  },
  nav: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("MutualFund", mutualFundSchema);
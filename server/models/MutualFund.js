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

  amfiCode: {
    type: String
  },

  category: {
    type: String
  },

  nav: {
    type: Number,
    required: true
  },

  fundHouse: {
    type: String
  },

  lastUpdated: {
    type: Date
  }

}, {
  timestamps: true
});

module.exports = mongoose.model(
  "MutualFund",
  mutualFundSchema
);
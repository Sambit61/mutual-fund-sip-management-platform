const Transaction = require("../models/Transaction");
const MutualFund = require("../models/MutualFund");
const axios = require("axios");
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();


// ================= BUY =================
exports.buyAsset = async (req, res) => {
  try {

    const { fundId, symbol, amount, assetType } = req.body;

    let price;

    // 🔹 FUND
    if (assetType === "FUND") {

      const fund = await MutualFund.findById(fundId);

      if (!fund) {
        return res.status(404).json({ message: "Fund not found" });
      }

      price = fund.nav;
    }

    // 🔹 STOCK
    if (assetType === "STOCK") {
      try {
        const quote = await yahooFinance.quote(symbol);
        price = quote.regularMarketPrice;
      } catch (err) {
        console.error("Yahoo Finance error in buyAsset:", err);
      }

      if (!price) {
        return res.status(400).json({ message: "Invalid stock price" });
      }
    }

    if (!price) {
      return res.status(400).json({ message: "Invalid assetType" });
    }

    const units = amount / price;

    const transaction = await Transaction.create({
      investor: req.user._id,
      fund: assetType === "FUND" ? fundId : null,
      symbol: assetType === "STOCK" ? symbol : null,
      amount,
      nav: price,
      units,
      assetType,
      type: "BUY"
    });

    res.json(transaction);

  } catch (err) {
    console.error("BUY ERROR:", err);
    res.status(500).json({ message: "Investment failed" });
  }
};


// ================= REDEEM =================
exports.redeemFund = async (req, res) => {
  try {

    const { fundId, units } = req.body;

    const fund = await MutualFund.findById(fundId);

    if (!fund) {
      return res.status(404).json({ message: "Fund not found" });
    }

    const nav = fund.nav;
    const amount = units * nav;

    const transaction = await Transaction.create({
      investor: req.user._id,
      fund: fundId,
      amount,
      nav,
      units: -units,
      type: "SELL",
      assetType: "FUND"
    });

    res.status(201).json(transaction);

  } catch (error) {
    console.error("REDEEM ERROR:", error);
    res.status(500).json({ message: "Redeem failed" });
  }
};


// ================= TRANSACTIONS =================
exports.getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ investor: req.user._id })
      .populate("fund", "fundName nav");

    // 🔹 prevent crash if fund is null
    const safeTransactions = transactions.map(txn => ({
      ...txn._doc,
      fund: txn.fund || null
    }));

    res.json(safeTransactions);

  } catch (error) {
    console.error("TRANSACTION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ================= PORTFOLIO =================
exports.getPortfolio = async (req, res) => {
  try {
    const transactions = await Transaction
      .find({ investor: req.user._id })
      .populate("fund");

    const portfolio = {};

    for (let txn of transactions) {

      // 🔹 fallback for old data
      if (!txn.assetType) txn.assetType = "FUND";

      // 🔹 FUND (safe check)
      if (txn.assetType === "FUND" && txn.fund) {

        const key = txn.fund._id.toString();

        if (!portfolio[key]) {
          portfolio[key] = {
            name: txn.fund.fundName,
            totalUnits: 0,
            totalInvestment: 0,
            nav: txn.fund.nav,
            isStock: false
          };
        }

        portfolio[key].totalUnits += txn.units;
        portfolio[key].totalInvestment += txn.amount;
      }

      // 🔹 STOCK
      if (txn.assetType === "STOCK" && txn.symbol) {

        const key = txn.symbol;

        if (!portfolio[key]) {
          portfolio[key] = {
            name: txn.symbol,
            totalUnits: 0,
            totalInvestment: 0,
            isStock: true
          };
        }

        portfolio[key].totalUnits += txn.units;
        portfolio[key].totalInvestment += txn.amount;
      }
    }

    // 🔹 Calculate values
    for (let key in portfolio) {

      const item = portfolio[key];

      // FUND
      if (!item.isStock) {
        item.currentValue = item.totalUnits * item.nav;
      }

      // STOCK
      if (item.isStock) {

        try {
          const quote = await yahooFinance.quote(item.name);
          const price = quote.regularMarketPrice || 0;
          item.currentValue = item.totalUnits * price;

        } catch (err) {
          console.error("Stock price error:", item.name);
          item.currentValue = 0;
        }
      }

      item.profitLoss = item.currentValue - item.totalInvestment;
    }

    res.json(Object.values(portfolio));

  } catch (error) {
    console.error("PORTFOLIO ERROR:", error);
    res.status(500).json({ message: "Error calculating portfolio" });
  }
};


// ================= SWITCH =================
exports.switchFund = async (req, res) => {
  try {
    const { fromFundId, toFundId, units } = req.body;

    // 1. Validate both funds
    const fromFund = await MutualFund.findById(fromFundId);
    const toFund = await MutualFund.findById(toFundId);

    if (!fromFund || !toFund) {
      return res.status(404).json({ message: "One or both funds not found" });
    }

    // 2. Calculate Redemption (SELL)
    const redeemAmount = units * fromFund.nav;

    // 3. Calculate Purchase (BUY)
    const buyUnits = redeemAmount / toFund.nav;

    // Note: Since you use Compass/Standalone MongoDB for development, 
    // we perform these sequentially without Mongoose sessions to avoid local crashes.

    // 4. Execute SELL transaction
    const sellTransaction = await Transaction.create({
      investor: req.user._id,
      fund: fromFundId,
      amount: redeemAmount,
      nav: fromFund.nav,
      units: -units, // Negative units for selling
      type: "SELL",
      assetType: "FUND"
    });

    // 5. Execute BUY transaction
    const buyTransaction = await Transaction.create({
      investor: req.user._id,
      fund: toFundId,
      amount: redeemAmount,
      nav: toFund.nav,
      units: buyUnits,
      type: "BUY",
      assetType: "FUND"
    });

    res.status(201).json({
      message: "Switch successful",
      sellTransaction,
      buyTransaction
    });

  } catch (error) {
    console.error("SWITCH ERROR:", error);
    res.status(500).json({ message: "Fund switch failed" });
  }
};
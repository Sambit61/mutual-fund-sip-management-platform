const Transaction = require("../models/Transaction");
const MutualFund = require("../models/MutualFund");
//buying funds 
exports.buyFund = async (req, res) => {
  try {
    const { fundId, amount } = req.body;

    const fund = await MutualFund.findById(fundId);

    if (!fund) {
      return res.status(404).json({ message: "Fund not found" });
    }

    const nav = fund.nav;

    const units = amount / nav;

    const transaction = await Transaction.create({
      investor: req.user._id,
      fund: fundId,
      amount,
      nav,
      units
    });

    res.status(201).json(transaction);

  } catch (error) {
    res.status(500).json({ message: "Transaction failed" });
  }
};
//sell or exit funds 
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
      type: "REDEEM"
    });

    res.status(201).json(transaction);

  } catch (error) {
    res.status(500).json({ message: "Redeem failed" });
  }
};
//transaction history
exports.getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ investor: req.user._id })
      .populate("fund", "fundName nav");

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
};
//portfolio function
exports.getPortfolio = async (req, res) => {
  try {

    const transactions = await Transaction
      .find({ investor: req.user._id })
      .populate("fund");

    const portfolio = {};

    transactions.forEach((txn) => {

      const fundId = txn.fund._id.toString();

      if (!portfolio[fundId]) {
        portfolio[fundId] = {
          fundName: txn.fund.fundName,
          totalUnits: 0,
          totalInvestment: 0,
          nav: txn.fund.nav
        };
      }

      portfolio[fundId].totalUnits += txn.units;
      portfolio[fundId].totalInvestment += txn.amount;

    });

    const result = Object.values(portfolio).map((fund) => {

      const currentValue = fund.totalUnits * fund.nav;

      const profitLoss = currentValue - fund.totalInvestment;

      return {
        fundName: fund.fundName,
        totalUnits: fund.totalUnits,
        totalInvestment: fund.totalInvestment,
        currentValue: currentValue,
        profitLoss: profitLoss
      };

    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: "Error calculating portfolio" });
  }
};
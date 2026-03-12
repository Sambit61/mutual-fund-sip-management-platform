const MutualFund = require("../models/MutualFund");

exports.createFund = async (req, res) => {
  try {
    const fund = await MutualFund.create(req.body);
    res.status(201).json(fund);
  } catch (error) {
    res.status(500).json({ message: "Error creating fund" });
  }
};

exports.getFunds = async (req, res) => {
  try {
    const funds = await MutualFund.find();
    res.json(funds);
  } catch (error) {
    res.status(500).json({ message: "Error fetching funds" });
  }
};
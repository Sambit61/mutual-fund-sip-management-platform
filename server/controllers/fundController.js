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
  console.log("getFunds start");
  try {
    console.log("getFunds before MutualFund.find");
    const funds = await MutualFund.find();
    console.log("getFunds got from DB:", funds.length);
    res.json(funds);
    console.log("getFunds sent response");
  } catch (error) {
    res.status(500).json({ message: "Error fetching funds" });
  }
};
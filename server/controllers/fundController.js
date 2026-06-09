const MutualFund = require("../models/MutualFund");
const axios = require("axios");
// ✅ CREATE FUND

exports.createFund = async (req, res) => {

  try {

    const fund = await MutualFund.create(req.body);

    res.status(201).json(fund);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error creating fund"
    });

  }

};

// ✅ GET ALL FUNDS

exports.getFunds = async (req, res) => {

  console.log("getFunds start");

  try {

    console.log("getFunds before MutualFund.find");

    const funds = await MutualFund.find();

    console.log("getFunds got from DB:", funds.length);

    res.json(funds);

    console.log("getFunds sent response");

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error fetching funds"
    });

  }

};

// ✅ DELETE FUND

exports.deleteFund = async (req, res) => {

  try {

    const fund = await MutualFund.findById(
      req.params.id
    );

    if (!fund) {

      return res.status(404).json({
        message: "Fund not found"
      });

    }

    await fund.deleteOne();

    res.json({
      message: "Fund deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error deleting fund"
    });

  }

};

// ✅ UPDATE FUND

exports.updateFund = async (req, res) => {

  try {

    const fund = await MutualFund.findById(
      req.params.id
    );

    if (!fund) {

      return res.status(404).json({
        message: "Fund not found"
      });

    }
   

    // ✅ UPDATE VALUES

    fund.fundName =
      req.body.fundName || fund.fundName;

    fund.category =
      req.body.category || fund.category;

    fund.nav =
      req.body.nav || fund.nav;

    await fund.save();

    res.json({
      message: "Fund updated successfully",
      fund
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error updating fund"
    });

  }

};
exports.syncFundNav = async (req, res) => {

  try {

    const fund = await MutualFund.findById(
      req.params.id
    );

    if (!fund) {

      return res.status(404).json({
        message: "Fund not found"
      });

    }

    if (!fund.amfiCode) {

      return res.status(400).json({
        message: "AMFI Code missing"
      });

    }

    const response = await axios.get(
      `https://api.mfapi.in/mf/${fund.amfiCode}`
    );

    const latestData =
      response.data.data[0];

    fund.nav =
      Number(latestData.nav);

    fund.lastUpdated =
      new Date();

    await fund.save();

    res.json({
      message:
        "NAV synced successfully",
      nav: fund.nav
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Failed to sync NAV"
    });

  }

};
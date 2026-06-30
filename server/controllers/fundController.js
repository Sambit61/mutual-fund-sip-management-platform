const MutualFund = require("../models/MutualFund");
const axios = require("axios");

const popularFunds = [
  122639, // Parag Parikh Flexi Cap
  120503, // HDFC Flexi Cap
  120716, // SBI Bluechip
  118834, // ICICI Bluechip
  120716, // Axis Bluechip
  118989, // Quant Small Cap
  119551, // SBI Small Cap
  120828, // Nippon Small Cap
  118778, // Motilal Oswal Midcap
  118551  // HDFC Midcap Opportunities
];
// CREATE FUND

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

// GET ALL FUNDS

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

// DELETE FUND

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

// UPDATE FUND

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

//sync fund
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

//sync all
exports.syncAllFundNavs = async (req, res) => {
  try {

    const funds =
      await MutualFund.find({
        amfiCode: {
          $exists: true,
          $ne: null
        }
      });

    let updatedCount = 0;

    for (const fund of funds) {

      try {

        const response =
          await axios.get(
            `https://api.mfapi.in/mf/${fund.amfiCode}`
          );

        const latestData =
          response.data.data[0];

        fund.nav =
          Number(latestData.nav);

        fund.lastUpdated =
          new Date();

        await fund.save();

        updatedCount++;

      } catch (err) {

        console.error(
          `Failed for ${fund.fundName}:`,
          err.message
        );

      }
    }

    res.json({
      message:
        `${updatedCount} funds synced successfully`
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Failed to sync all NAVs"
    });

  }
};

//search funds
exports.searchFunds = async (req, res) => {
  try {

    const query = req.query.q;

    if (!query) {
      return res.json([]);
    }

    const response = await axios.get(
      "https://api.mfapi.in/mf"
    );

    const results = response.data
      .filter((fund) =>
        fund.schemeName
          .toLowerCase()
          .includes(query.toLowerCase())
      )
      .slice(0, 15);

    res.json(results);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Search failed"
    });

  }
};

//import fund
exports.importFund = async (req, res) => {
  try {

    const { schemeCode } = req.body;

    const exists = await MutualFund.findOne({
      amfiCode: schemeCode
    });

    if (exists) {
      return res.status(400).json({
        message: "Fund already exists"
      });
    }

    const response = await axios.get(
      `https://api.mfapi.in/mf/${schemeCode}`
    );

    const fundData = response.data;

    const latestNAV =
      fundData.data[0];

    const fund = await MutualFund.create({
      fundName:
        fundData.meta.scheme_name,

      amfiCode:
        schemeCode,

      category:
        fundData.meta.scheme_category ||
        "Unknown",

      nav:
        Number(latestNAV.nav),

      fundCode:
        schemeCode
    });

    res.json(fund);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Import failed"
    });

  }
};

//top funds
exports.getTopFunds = async (req, res) => {

  try {

    const funds = [];

    for (const code of popularFunds) {

      try {

        const response =
          await axios.get(
            `https://api.mfapi.in/mf/${code}`
          );

        const latest =
          response.data.data[0];

        const previous =
          response.data.data[1];

        const changePercent =
          (
            (
              Number(latest.nav) -
              Number(previous.nav)
            ) /
            Number(previous.nav)
          ) * 100;

        funds.push({
          name:
            response.data.meta.scheme_name,

          nav:
            Number(latest.nav),

          changePercent
        });

      } catch (err) {

        console.log(
          `Failed for ${code}`
        );

      }
    }

    const gainers =
      [...funds]
      .sort(
        (a,b) =>
          b.changePercent -
          a.changePercent
      )
      .slice(0,5);

    const losers =
      [...funds]
      .sort(
        (a,b) =>
          a.changePercent -
          b.changePercent
      )
      .slice(0,5);

    res.json({
      gainers,
      losers
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message:
        "Failed to fetch top funds"
    });

  }
};
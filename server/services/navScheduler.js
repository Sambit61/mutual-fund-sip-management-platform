const cron = require("node-cron");
const MutualFund = require("../models/MutualFund");
const axios = require("axios");

const startNAVScheduler = () => {

  cron.schedule("0 2 * * *", async () => {

    console.log("Running automatic NAV sync...");

    const funds = await MutualFund.find({
      amfiCode: {
        $exists: true,
        $ne: null
      }
    });

    for (const fund of funds) {

      try {

        const response =
          await axios.get(
            `https://api.mfapi.in/mf/${fund.amfiCode}`
          );

        const latestNAV =
          response.data.data[0].nav;

        fund.nav =
          Number(latestNAV);

        fund.lastUpdated =
          new Date();

        await fund.save();

      } catch (err) {

        console.log(
          `Failed to update ${fund.fundName}`
        );

      }
    }

    console.log(
      "Automatic NAV sync completed"
    );

  });

};

module.exports = startNAVScheduler;
const cron = require("node-cron");
const SIP = require("../models/SIP");
const MutualFund = require("../models/MutualFund");
const Transaction = require("../models/Transaction");

const runSIPScheduler = () => {

  cron.schedule("0 0 * * *", async () => {
    console.log("Running SIP scheduler...");

    const today = new Date();

    const dueSIPs = await SIP.find({
      status: "ACTIVE",
      nextRun: { $lte: today }
    });

    for (const sip of dueSIPs) {

      const fund = await MutualFund.findById(sip.fund);

      if (!fund) continue;

      const nav = fund.nav;
      const units = sip.amount / nav;

      await Transaction.create({
        investor: sip.investor,
        fund: sip.fund,
        amount: sip.amount,
        nav: nav,
        units: units,
        type: "BUY"
      });

      // schedule next month
      const nextDate = new Date(sip.nextRun);
      nextDate.setMonth(nextDate.getMonth() + 1);

      sip.nextRun = nextDate;
      await sip.save();
    }
  });

};

module.exports = runSIPScheduler;
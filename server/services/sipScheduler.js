const cron = require("node-cron");
const SIP = require("../models/SIP");
const MutualFund = require("../models/MutualFund");
const Transaction = require("../models/Transaction");

const runSIPScheduler = () => {

  cron.schedule("0 0 * * *", async () => {
    console.log("Running SIP scheduler...");

    const today = new Date();

    const dueSIPs = await SIP.find({
      status: { $in: ["ACTIVE", "RETRYING"] },
      nextRun: { $lte: today }
    });

    for (const sip of dueSIPs) {

      const fund = await MutualFund.findById(sip.fund);

      if (!fund) continue;

      // --- SIMULATE PAYMENT PROCESS ---
      // We simulate a 20% chance of payment failure to demonstrate the retry mechanism
      const isPaymentFailed = Math.random() < 0.2;

      if (isPaymentFailed) {
        console.log(`Payment failed for SIP ${sip._id}. Attempt: ${sip.retryCount + 1}`);
        
        sip.retryCount += 1;
        
        if (sip.retryCount >= 3) {
          console.log(`SIP ${sip._id} failed after 3 retries. Marking as FAILED.`);
          sip.status = "FAILED";
        } else {
          sip.status = "RETRYING";
          // Schedule next retry for tomorrow
          const nextRetry = new Date();
          nextRetry.setDate(nextRetry.getDate() + 1);
          sip.nextRun = nextRetry;
        }
        
        await sip.save();
        continue;
      }

      // --- SUCCESSFUL PAYMENT ---
      const nav = fund.nav;
      const units = sip.amount / nav;

      await Transaction.create({
        investor: sip.investor,
        fund: sip.fund,
        amount: sip.amount,
        nav: nav,
        units: units,
        type: "BUY",
        assetType: "FUND"
      });

      // schedule next month
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + 1);
      
      // keep original start date day if possible
      if (sip.startDate) {
        nextDate.setDate(sip.startDate.getDate());
      }

      sip.nextRun = nextDate;
      sip.status = "ACTIVE";
      sip.retryCount = 0; // reset on success
      await sip.save();
      
      console.log(`Successfully processed SIP ${sip._id}`);
    }
  });

};

module.exports = runSIPScheduler;
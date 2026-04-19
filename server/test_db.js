const mongoose = require("mongoose");
const MutualFund = require("./models/MutualFund");
require("dotenv").config();

async function testDB() {
  console.log("Connecting to", process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected. Fetching funds...");
    const funds = await MutualFund.find().limit(5);
    console.log("Found funds:", funds.length);
    process.exit(0);
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
}
testDB();

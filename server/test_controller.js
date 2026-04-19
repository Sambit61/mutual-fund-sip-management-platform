const mongoose = require("mongoose");
require("dotenv").config();
const { getFunds } = require("./controllers/fundController");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected");
  const req = {};
  const res = {
    json: (data) => console.log("JSON CALLED WITH ITEMS:", data.length),
    status: (s) => ({ json: (d) => console.log("STATUS", s, d) })
  };
  await getFunds(req, res);
  process.exit(0);
}
run();

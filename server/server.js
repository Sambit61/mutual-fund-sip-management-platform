const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes=require("./routes/authRoutes")
const testRoutes =require("./routes/testRoutes");
const fundRoutes=require("./routes/fundRoutes");
const transactionRoutes=require("./routes/transactionRoutes");
const sipRoutes = require("./routes/sipRoutes");
const runSIPScheduler = require("./services/sipScheduler");
dotenv.config();

connectDB();
runSIPScheduler();
const app = express();

app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/test",testRoutes);
app.use("/api/funds",fundRoutes);
app.use("/api/transactions",transactionRoutes);
app.use("/api/sip",sipRoutes);

app.get("/", (req, res) => {
  res.send("Mutual Fund SIP API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
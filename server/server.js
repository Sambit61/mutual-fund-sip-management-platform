require("dotenv").config({ path: "./.env" });

console.log(
  "TEST ENV:",
  process.env.FINNHUB_API_KEY
);

const express = require("express");

const dotenv = require("dotenv");

const connectDB = require("./config/db");

const cors = require("cors");

// ✅ ROUTES

const authRoutes =
  require("./routes/authRoutes");

const testRoutes =
  require("./routes/testRoutes");

const fundRoutes =
  require("./routes/fundRoutes");

const transactionRoutes =
  require("./routes/transactionRoutes");

const sipRoutes =
  require("./routes/sipRoutes");

const marketRoutes =
  require("./routes/marketRoutes");

const paymentRoutes =
  require("./routes/paymentRoutes");

const adminRoutes =
  require("./routes/adminRoutes");

// ✅ SERVICES

const runSIPScheduler =
  require("./services/sipScheduler");

dotenv.config();

// ✅ CONNECT DATABASE

connectDB();

const app = express();

// ✅ REQUEST LOGGER

app.use((req, res, next) => {

  console.log(
    "INCOMING REQUEST:",
    req.method,
    req.url
  );

  next();

});

// ✅ CORS

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mfsip.vercel.app"
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ],
    credentials: true
  })
);

// ✅ BODY PARSER

app.use(express.json());

// ✅ SIP SCHEDULER

runSIPScheduler();

// ✅ API ROUTES

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use(
  "/api/funds",
  (req, res, next) => {

    console.log(
      "/api/funds middleware hit"
    );

    next();

  },
  fundRoutes
);

app.use(
  "/api/transactions",
  transactionRoutes
);

app.use("/api/sip", sipRoutes);

app.use("/api/market", marketRoutes);

app.use("/api/payment", paymentRoutes);

// ✅ ADMIN ROUTES

app.use("/api/admin", adminRoutes);

// ✅ ROOT ROUTE

app.get("/", (req, res) => {

  res.send(
    "Mutual Fund SIP API running"
  );

});

// ✅ SERVER

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
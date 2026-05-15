const express = require("express");
const axios = require("axios");

const router = express.Router();

//STOCKS  (Finnhub)
router.get("/stocks", async (req, res) => {
  console.log("MARKET STOCKS HIT");
  try {
    const apiKey = process.env.FINNHUB_API_KEY;

    console.log("API KEY:", apiKey);

    const symbols = ["AAPL", "MSFT", "TSLA", "AMZN", "GOOGL"];

    const stocks = [];

    for (let symbol of symbols) {

      try {

        const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
        console.log("Calling:", url);

        const response = await axios.get(url);

        console.log("Response:", response.data);

        stocks.push({
          symbol,
          price: response.data.c,
          change: response.data.d,
          percent: response.data.dp
        });

        // 🔹 small delay (optional but safer)
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (err) {

        console.error(`Error for ${symbol}:`, err.response?.data || err.message);

      }

    }

    res.json(stocks);

  } catch (error) {

    console.error("Main error:", error.message);
    res.status(500).json({ message: "Error fetching stocks" });

  }

});
// HISTORY (ALPHA VANTAGE)
// HISTORY (FINNHUB)
router.get("/history/:symbol", async (req, res) => {

  try {

    const { symbol } = req.params;

    const to = Math.floor(Date.now() / 1000);

    const from = to - (30 * 24 * 60 * 60);

    const response = await axios.get(
      "https://finnhub.io/api/v1/stock/candle",
      {
        params: {
          symbol,
          resolution: "D",
          from,
          to,
          token: process.env.FINNHUB_API_KEY
        }
      }
    );

    // ❌ No data
    if (response.data.s !== "ok") {
      return res.status(400).json({
        message: "No chart data found"
      });
    }

    // ✅ Format chart data
    const formatted = response.data.t.map((time, index) => ({
      date: new Date(time * 1000).toLocaleDateString(),
      close: response.data.c[index]
    }));

    res.json(formatted);

  } catch (err) {

    console.error("HISTORY ERROR:", err.message);

    res.status(500).json({
      message: "Error fetching history"
    });

  }

});
module.exports = router;
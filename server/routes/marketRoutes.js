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
router.get("/history/:symbol", async (req, res) => {

  try {

    const { symbol } = req.params;

    const apiKey = process.env.ALPHA_VANTAGE_KEY;

    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
    );

    const data = response.data["Time Series (Daily)"];

    if (!data) {
      return res.status(400).json({ message: "No data found" });
    }

    const formatted = Object.keys(data).map(date => ({
      date,
      close: parseFloat(data[date]["4. close"])
    }));

    const finalData = formatted.slice(0, 30).reverse(); // last 30 days
    res.json(finalData);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Error fetching history" });

  }

});
module.exports = router;
const express = require("express");
const axios = require("axios");
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

const router = express.Router();

//STOCKS (YAHOO FINANCE)
router.get("/stocks", async (req, res) => {
  console.log("MARKET STOCKS HIT");
  try {
    const symbols = ["AAPL", "MSFT", "TSLA", "AMZN", "GOOGL"];
    const stocks = [];

    for (let symbol of symbols) {
      try {
        const quote = await yahooFinance.quote(symbol);
        stocks.push({
          symbol,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          percent: quote.regularMarketChangePercent
        });
      } catch (err) {
        console.error(`Error for ${symbol}:`, err.message);
      }
    }

    res.json(stocks);

  } catch (error) {
    console.error("Main error:", error.message);
    res.status(500).json({ message: "Error fetching stocks" });
  }
});

// HISTORY (YAHOO FINANCE)
router.get("/history/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 30); // Last 30 days

    const result = await yahooFinance.chart(symbol, {
      period1: fromDate,
      period2: toDate,
      interval: '1d'
    });

    if (!result || !result.quotes || result.quotes.length === 0) {
      return res.status(400).json({
        message: "No chart data found"
      });
    }

    // ✅ Format chart data for frontend
    const formatted = result.quotes.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      close: item.close
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
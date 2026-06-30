const express = require("express");
const axios = require("axios");
const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();
const isProduction =
  process.env.NODE_ENV === "production";

const router = express.Router();

let stocksCache = null;
let stocksCacheTime = 0;

let indicesCache = null;
let indicesCacheTime = 0;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

//STOCKS (YAHOO FINANCE)
router.get("/stocks", async (req, res) => {
  console.log("MARKET STOCKS HIT");

  if (
    stocksCache &&
    Date.now() - stocksCacheTime < CACHE_DURATION
  ) {
    console.log("Returning cached stocks");
  
    return res.json(stocksCache);
  }

  try {
    const symbols = [
      "AAPL",
      "MSFT",
      "TSLA",
      "AMZN",
      "GOOGL",

      "META",
      "NVDA",
      "NFLX",
      "AMD",
      "INTC",

      "ORCL",
      "IBM",
      "CRM",
      "ADBE",
      "UBER",

      "JPM",
      "BAC",
      "WMT",
      "KO",
      "PEP",
    ];

    const stocks = [];

    for (let symbol of symbols) {
      try {
    
        let quote;
    
        if (isProduction) {
          const response = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
          );
    
          quote = {
            regularMarketPrice: response.data.c,
            regularMarketChange: response.data.d,
            regularMarketChangePercent: response.data.dp,
            marketCap: null,
            trailingPE: null,
            fiftyTwoWeekHigh: null,
            fiftyTwoWeekLow: null,
            longName: symbol
          };
    
        } else {
    
          quote = await yahooFinance.quote(symbol);
    
        }
    
        stocks.push({
          symbol,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          percent: quote.regularMarketChangePercent,
          marketCap: quote.marketCap,
          peRatio: quote.trailingPE,
          high52Week: quote.fiftyTwoWeekHigh,
          low52Week: quote.fiftyTwoWeekLow,
          companyName: quote.longName,
          sector: "Unknown"
        });
    
      } catch (err) {
        console.error(`Error for ${symbol}:`, err.message);
      }
    }
   stocksCache = stocks;
stocksCacheTime = Date.now();

res.json(stocks);
  } catch (error) {
    console.error("Main error:", error.message);

    res.status(500).json({
      message: "Error fetching stocks",
    });
  }
});

//indices
router.get("/indices", async (req, res) => {
  res.json([
    {
      symbol: "NIFTY",
      name: "NIFTY 50",
      price: 25431.25,
      percent: 0.84,
    },
    {
      symbol: "SENSEX",
      name: "SENSEX",
      price: 83412.67,
      percent: 0.72,
    },
    {
      symbol: "NASDAQ",
      name: "NASDAQ",
      price: 22756.18,
      percent: 1.12,
    },
    {
      symbol: "SP500",
      name: "S&P 500",
      price: 6198.45,
      percent: 0.91,
    },
    {
      symbol: "DJI",
      name: "Dow Jones",
      price: 43825.32,
      percent: 0.58,
    },
  ]);
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
      interval: "1d",
    });

    if (!result || !result.quotes || result.quotes.length === 0) {
      return res.status(400).json({
        message: "No chart data found",
      });
    }

    // ✅ Format chart data for frontend
    const formatted = result.quotes.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      close: item.close,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("HISTORY ERROR:", err.message);
    res.status(500).json({
      message: "Error fetching history",
    });
  }
});

//news feed
router.get("/news", async (req, res) => {
  try {
    const news = await yahooFinance.search("stock market");

    res.json(news.news || []);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch news",
    });
  }
});

//candles
router.get("/candles/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const endDate = new Date();

    const startDate = new Date();

    const range = req.query.range || "3mo";

    switch (range) {
      case "1mo":
        startDate.setMonth(startDate.getMonth() - 1);
        break;

      case "3mo":
        startDate.setMonth(startDate.getMonth() - 3);
        break;

      case "6mo":
        startDate.setMonth(startDate.getMonth() - 6);
        break;

      case "1y":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;

      default:
        startDate.setMonth(startDate.getMonth() - 3);
    }

    const result = await yahooFinance.chart(symbol, {
      period1: startDate,
      period2: endDate,
      interval: "1d",
    });

    const candles = result.quotes.map((item) => ({
      date: item.date,

      open: item.open,

      high: item.high,

      low: item.low,

      close: item.close,

      volume: item.volume
    }));

    res.json(candles);
  } catch (err) {
    console.error("CANDLE ERROR:", err);

    res.status(500).json({
      message: "Error fetching candles",
    });
  }
});

module.exports = router;

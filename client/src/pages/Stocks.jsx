import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

import toast from "react-hot-toast";

import StockInvestModal from "../components/StockInvestModal";

import { TrendingUp } from "lucide-react";

import StockDetailsModal from "../components/StockDetailsModal";

import CandlestickChart from "../components/CandlestickChart";

function Stocks() {
  const navigate = useNavigate();

  const [stocks, setStocks] = useState([]);

  const topGainers = [...stocks]
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 5);

  const topLosers = [...stocks]
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 5);

  const [selectedStock, setSelectedStock] = useState(null);

  const [detailsStock, setDetailsStock] = useState(null);

  const [search, setSearch] = useState("");

  const [sectorFilter, setSectorFilter] = useState("All");

  const [visibleStocks, setVisibleStocks] = useState(12);
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await api.get("/market/stocks");
  
        console.log("Stocks API response:", res.data);
  
        setStocks(res.data);
      } catch (err) {
        console.error("Stocks fetch error:", err);
      }
    };
  
    fetchStocks();
  }, []);

  const addToWatchlist = async (stock) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/watchlist/add",
        {
          symbol: stock.symbol,
          type: "stock",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Added to watchlist");
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Failed to add to watchlist");
    }
  };

  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch = stock.symbol
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesSector =
      sectorFilter === "All" || stock.sector === sectorFilter;

    return matchesSearch && matchesSector;
  });

  const sectors = ["All", ...new Set(stocks.map((stock) => stock.sector))];

  return (
    <div className="p-8 min-h-screen text-white max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Market Stocks</h1>
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-card-bg p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-bold text-green-400 mb-4">Top Gainers</h2>

          {topGainers.map((stock) => (
            <div
              key={stock.symbol}
              className="flex justify-between py-3 border-b border-gray-800"
            >
              <span>{stock.symbol}</span>

              <span className="text-green-400 font-bold">
                +{stock.percent?.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        <div className="bg-card-bg p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-bold text-red-400 mb-4">Top Losers</h2>

          {topLosers.map((stock) => (
            <div
              key={stock.symbol}
              className="flex justify-between py-3 border-b border-gray-800"
            >
              <span>{stock.symbol}</span>

              <span className="text-red-400 font-bold">
                {stock.percent?.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search Stocks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-3 rounded-lg bg-card-bg border border-gray-700 text-white"
        />
      </div>
      <div className="flex flex-wrap gap-3 mb-8">
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setSectorFilter(sector)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              sectorFilter === sector
                ? "bg-brand text-black"
                : "bg-card-bg border border-gray-700 text-gray-300 hover:border-brand hover:text-white"
            }`}
          >
            {sector}
          </button>
        ))}
      </div>

      

      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-brand" />
        Market Stocks
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStocks.slice(0, visibleStocks).map((stock, index) => {
          const isPositive = stock.percent >= 0;

          return (
            <div
              key={index}
              className="bg-[var(--color-card-bg)] border border-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-white">{stock.symbol}</h3>

                <span
                  className={`text-sm font-bold px-2 py-1 rounded bg-opacity-20 ${
                    isPositive
                      ? "text-brand bg-brand"
                      : "text-red-400 bg-red-400"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {stock.percent}%
                </span>
              </div>

              <p className="text-2xl font-bold text-white mb-6">
                ${stock.price}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedStock(stock)}
                  className="flex-1 bg-brand text-gray-900 py-2 rounded-lg font-bold hover:bg-brand-dark hover:text-white transition"
                >
                  Invest
                </button>

                <button
                  onClick={() => {
                    localStorage.setItem("selectedStock", stock.symbol);

                    navigate("/dashboard");
                  }}
                  className="flex-1 bg-[var(--color-card-bg-light)] text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  View Chart
                </button>
                <button
                  onClick={() => setDetailsStock(stock)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  Details
                </button>
                <button
                  onClick={() => addToWatchlist(stock)}
                  className="
    flex-1
    bg-yellow-500
    text-black
    py-2
    rounded-lg
    font-semibold
    hover:bg-yellow-400
    transition
  "
                >
                  ⭐ Watchlist
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedStock && (
        <StockInvestModal
          stock={selectedStock}
          closeModal={() => setSelectedStock(null)}
        />
      )}

      {detailsStock && (
        <StockDetailsModal
          stock={detailsStock}
          closeModal={() => setDetailsStock(null)}
        />
      )}
      {visibleStocks < filteredStocks.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleStocks((prev) => prev + 8)}
            className="px-6 py-3 rounded-lg bg-brand text-black font-bold"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default Stocks;

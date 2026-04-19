import { useEffect, useState } from "react";
import api from "../api/api";
import InvestModal from "./InvestModals";
import { Search, Filter, TrendingUp, DollarSign } from "lucide-react";

function Funds() {

  const [funds, setFunds] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [stockAmounts, setStockAmounts] = useState({});

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");

  // 🔹 FETCH DATA
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const res = await api.get("/funds");
        setFunds(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchStocks = async () => {
      try {
        const res = await api.get("/market/stocks");
        setStocks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFunds();
    fetchStocks();
  }, []);

  // 🔹 HANDLE INPUT
  const handleStockAmountChange = (symbol, value) => {
    setStockAmounts({
      ...stockAmounts,
      [symbol]: value
    });
  };

  // 🔹 HANDLE INVEST
  const handleStockInvest = async (stock) => {
    const amount = stockAmounts[stock.symbol];

    if (!amount) {
      alert("Enter amount first");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/transactions/buy",
        {
          symbol: stock.symbol,
          amount: Number(amount),
          assetType: "STOCK"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Stock investment successful");
    } catch (err) {
      console.error(err);
      alert("Investment failed");
    }
  };

  // 🔹 FILTER FUNDS
  let filteredFunds = funds.filter((fund) =>
    fund.fundName.toLowerCase().includes(search.toLowerCase())
  );

  if (categoryFilter !== "All") {
    filteredFunds = filteredFunds.filter(
      (fund) => fund.category === categoryFilter
    );
  }

  if (sortOrder === "navHigh") {
    filteredFunds.sort((a, b) => b.nav - a.nav);
  }

  if (sortOrder === "navLow") {
    filteredFunds.sort((a, b) => a.nav - b.nav);
  }

  return (
    <div className="p-8 min-h-screen text-white max-w-7xl mx-auto">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Explore Funds & Stocks</h1>
          <p className="text-sm text-gray-400">Discover and invest in top-performing assets</p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center bg-[var(--color-card-bg)] border border-gray-800 p-4 rounded-xl shadow-lg">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search funds..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[var(--color-bg-main)] border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-full text-sm focus:outline-none focus:border-brand text-white placeholder-gray-500 transition"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {["All", "Equity", "Debt", "Hybrid"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                categoryFilter === cat 
                  ? "bg-brand text-gray-900" 
                  : "bg-[var(--color-bg-main)] text-gray-400 border border-gray-700 hover:text-white hover:border-gray-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="ml-auto relative w-full md:w-auto flex items-center">
          <Filter className="text-gray-500 w-4 h-4 mr-2" />
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-[var(--color-bg-main)] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-brand appearance-none pr-8 cursor-pointer w-full md:w-auto"
          >
            <option value="none">Sort by NAV</option>
            <option value="navHigh">NAV: High to Low</option>
            <option value="navLow">NAV: Low to High</option>
          </select>
        </div>
      </div>

      {/* FUNDS */}
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-brand" /> Available Mutual Funds
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredFunds.map((fund) => (
          <div key={fund._id} className="bg-[var(--color-card-bg)] border border-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between hover:border-brand transition group">
            <div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-white group-hover:text-brand transition">{fund.fundName}</h3>
                <span className="text-xs font-bold px-2 py-1 bg-gray-800 rounded text-gray-300">{fund.category}</span>
              </div>
              <p className="text-3xl font-bold text-white mb-6">₹{fund.nav}</p>
            </div>
            <button
              onClick={() => setSelectedFund(fund)}
              className="w-full bg-[var(--color-card-bg-light)] text-white py-3 rounded-lg font-bold hover:bg-brand hover:text-gray-900 transition"
            >
              Invest in Fund
            </button>
          </div>
        ))}
      </div>

      {/* STOCKS */}
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-brand" /> Market Stocks
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stocks.map((stock, index) => {
          const isPositive = stock.percent >= 0;
          return (
            <div key={index} className="bg-[var(--color-card-bg)] border border-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-white">{stock.symbol}</h3>
                <span className={`text-sm font-bold px-2 py-1 rounded bg-opacity-20 ${isPositive ? 'text-brand bg-brand' : 'text-red-400 bg-red-400'}`}>
                  {isPositive ? '+' : ''}{stock.percent}%
                </span>
              </div>
              <p className="text-2xl font-bold text-white mb-6">${stock.price}</p>

              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Investment Amount ($)"
                  value={stockAmounts[stock.symbol] || ""}
                  onChange={(e) => handleStockAmountChange(stock.symbol, e.target.value)}
                  className="bg-[var(--color-bg-main)] border border-gray-700 rounded-lg p-3 w-full text-sm focus:outline-none focus:border-brand text-white placeholder-gray-500"
                />
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStockInvest(stock)}
                    className="flex-1 bg-brand text-gray-900 py-2 rounded-lg font-bold hover:bg-brand-dark hover:text-white transition"
                  >
                    Invest
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem("selectedStock", stock.symbol);
                      // In a real app we'd route properly, here we simulate dashboard reload
                      window.location.href = "/";
                    }}
                    className="flex-1 bg-[var(--color-card-bg-light)] text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
                  >
                    View Chart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedFund && (
        <InvestModal
          fund={selectedFund}
          closeModal={() => setSelectedFund(null)}
        />
      )}
    </div>
  );
}

export default Funds;
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/api";
import SummaryCard from "../components/SummaryCard";
import StockChart from "../components/StockChart";
import { Wallet, BarChart3, TrendingUp, Newspaper, PieChart, Rocket } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
  
        const res = await api.get(
          "/transactions/portfolio",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setPortfolio(res.data);
  
      } catch (err) {
        console.error(err);
  
        toast.error(
          "Failed to load portfolio"
        );
  
      } finally {
        setLoading(false);
      }
    };
  
    fetchPortfolio();
  }, [token]);


  useEffect(() => {
    const storedStock = localStorage.getItem("selectedStock");
    if (storedStock) setSelectedStock(storedStock);
  }, []);
  const { user } = useAuth();

  const totalInvestment = portfolio.reduce((sum, item) => sum + item.totalInvestment, 0);
  const totalValue = portfolio.reduce((sum, item) => sum + item.currentValue, 0);
  const totalProfit = totalValue - totalInvestment;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
  
          <p className="text-gray-400">
            Loading portfolio...
          </p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="p-8 min-h-screen text-white max-w-7xl mx-auto">
      
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
        <h1 className="text-4xl font-bold mb-2">
         Welcome back, {user?.name || "Investor"}</h1>                 
          <p className="text-xs text-gray-400 font-medium tracking-wider">PORTFOLIO PERFORMANCE • LAST UPDATED 2 MINS AGO</p>
        </div>
        <div className="flex gap-4">
          <button className="px-5 py-2 rounded font-semibold bg-[var(--color-card-bg-light)] text-gray-300 hover:text-white transition">
            Download Report
          </button>
          <button className="px-5 py-2 rounded font-semibold bg-brand text-gray-900 hover:bg-brand-dark hover:text-white transition">
            Invest Now
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Total Investment"
          value={`$${totalInvestment > 0 ? totalInvestment.toLocaleString(undefined, {minimumFractionDigits: 2}) : '128,450.00'}`}
          subtext="+12% from last quarter"
          icon={Wallet}
        />
        <SummaryCard
          title="Current Value"
          value={`$${totalValue > 0 ? totalValue.toLocaleString(undefined, {minimumFractionDigits: 2}) : '142,912.44'}`}
          subtext="Refined market valuation"
          icon={BarChart3}
        />
        <SummaryCard
          title="Profit/Loss"
          value={`+$${totalProfit > 0 ? totalProfit.toLocaleString(undefined, {minimumFractionDigits: 2}) : '14,462.44'}`}
          subtext={<><span className="text-brand bg-brand/10 px-1.5 py-0.5 rounded mr-1">+11.26%</span> All-time earnings</>}
          icon={TrendingUp}
        />
      </div>

      {/* Chart Section */}
      <div className="bg-[var(--color-card-bg)] border border-gray-800 rounded-xl p-4 md:p-6 mb-8 shadow-lg relative">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 whitespace-nowrap custom-scrollbar">
            {Array.from(new Set(["AAPL", "MSFT", "TSLA", "AMZN", "GOOGL", "NVDA", selectedStock])).map((symbol) => (
              <button
                key={symbol}
                onClick={() => {
                  setSelectedStock(symbol);
                  localStorage.setItem("selectedStock", symbol);
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedStock === symbol
                    ? "bg-brand text-gray-900"
                    : "bg-[var(--color-card-bg-light)] text-gray-400 hover:text-white"
                }`}
              >
                {symbol}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-gray-500 tracking-wider">TIMEFRAME</span>
            <div className="flex gap-3 text-gray-400">
              <button className="bg-[var(--color-card-bg-light)] text-white px-2 py-0.5 rounded">1D</button>
              <button className="hover:text-white">1W</button>
              <button className="hover:text-white">1M</button>
              <button className="hover:text-white">1Y</button>
              <button className="hover:text-white">ALL</button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start static lg:absolute z-10 w-full lg:pr-12 mb-4 lg:mb-0">
          <div>
            <h3 className="text-lg font-semibold text-white">{selectedStock}</h3>
            <p className="text-xs text-gray-400">Real-time Data</p>
          </div>
          <div className="text-right">
            {/* Price fetches could be added here later */}
          </div>
        </div>

        <div className="mt-8">
          <StockChart symbol={selectedStock} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Market Intelligence */}
        <div className="bg-[var(--color-card-bg)] border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-white flex items-center gap-2">Market Intelligence</h3>
            <button className="text-brand text-xs font-bold tracking-wider hover:text-brand-dark">VIEW ALL</button>
          </div>
          <div className="space-y-5">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded bg-gradient-to-br from-blue-900 to-emerald-900 flex-shrink-0"></div>
              <div>
                <p className="text-[10px] text-brand font-bold mb-1 tracking-wider">FINTECH TODAY</p>
                <p className="text-sm font-medium leading-tight">Digital transformation in mutual funds sees 40% growth in Asian markets.</p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-900 to-rose-900 flex-shrink-0"></div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold mb-1 tracking-wider">WEALTH MANAGEMENT</p>
                <p className="text-sm font-medium leading-tight text-gray-300">New regulations for algorithmic SIP contributions announced for 2025.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="bg-[var(--color-card-bg)] border border-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-white mb-6">Asset Allocation</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-300">Equities</span>
                <span className="text-white font-medium">65%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-300">Mutual Funds</span>
                <span className="text-white font-medium">25%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-300">Commodities</span>
                <span className="text-white font-medium">10%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart SIP CTA */}
        <div className="bg-brand rounded-xl p-6 shadow-lg text-gray-900 relative overflow-hidden">
          <h3 className="text-xl font-bold mb-3">Ready for Smart<br/>SIP?</h3>
          <p className="text-sm font-medium opacity-80 mb-6 max-w-[80%]">
            Automate your wealth creation with our AI-driven insights.
          </p>
          <button className="bg-gray-900 text-white px-5 py-2 rounded text-sm font-bold shadow-lg hover:bg-black transition">
            GET STARTED
          </button>
          <Rocket className="absolute -bottom-4 -right-4 w-24 h-24 text-black opacity-10" />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
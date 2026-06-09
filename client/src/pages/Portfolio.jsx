import { useEffect, useState } from "react";
import api from "../api/api";
import SummaryCard from "../components/SummaryCard";
import { useAuth } from "../context/AuthContext";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from "chart.js";

import { Pie, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function Portfolio() {

  const [portfolio, setPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const { token } = useAuth();
  console.log("TOKEN:", token);

  useEffect(() => {

    const fetchPortfolio = async () => {
      try {
        const res = await api.get("/transactions/portfolio", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPortfolio(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions/my", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTransactions(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPortfolio();
    fetchTransactions();

  }, [token]);

  // 🔹 SAFE TOTALS
  const totalInvestment = portfolio.reduce(
    (sum, item) => sum + (item.totalInvestment || 0),
    0
  );

  const totalValue = portfolio.reduce(
    (sum, item) => sum + (item.currentValue || 0),
    0
  );

  const totalProfit = totalValue - totalInvestment;

  // 🔹 PIE CHART
  const pieChartData = {
    labels: portfolio.map(item => item.name || "Unknown"),
    datasets: [
      {
        label: "Investment Distribution",
        data: portfolio.map(item => item.totalInvestment || 0),
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FF9800",
          "#9C27B0",
          "#E91E63",
          "#009688"
        ]
      }
    ]
  };

  // 🔹 LINE CHART (Growth)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  let cumulative = 0;

  const lineChartData = {
    labels: sortedTransactions.map(t =>
      new Date(t.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Portfolio Growth",
        data: sortedTransactions.map(t => {
          cumulative += (t.amount || 0);
          return cumulative;
        }),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76,175,80,0.2)",
        tension: 0.3,
        fill: true
      }
    ]
  };

  // 🔹 LOADING / EMPTY STATE
  if (!portfolio) {
    return <p className="p-8">Loading...</p>;
  }

  return (

    <div className="p-4 md:p-8 max-w-7xl mx-auto text-white">

      <h2 className="text-2xl md:text-3xl font-bold mb-6">Portfolio Dashboard</h2>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <SummaryCard
          title="Total Investment"
          value={`₹${totalInvestment.toFixed(2)}`}
        />

        <SummaryCard
          title="Current Value"
          value={`₹${totalValue.toFixed(2)}`}
        />

        <SummaryCard
          title="Profit / Loss"
          value={`₹${totalProfit.toFixed(2)}`}
        />

      </div>

      {/* PIE CHART */}
      {portfolio.length > 0 && (
        <div className="w-full max-w-md mx-auto md:mx-0 mb-8 bg-[var(--color-card-bg)] p-4 rounded-xl border border-gray-800 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-center md:text-left">Investment Distribution</h3>
          <Pie data={pieChartData} />
        </div>
      )}

      {/* LINE CHART */}
      {transactions.length > 0 && (
        <div className="w-full max-w-3xl mx-auto md:mx-0 mb-8 bg-[var(--color-card-bg)] p-4 rounded-xl border border-gray-800 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-center md:text-left">Portfolio Growth</h3>
          <Line data={lineChartData} />
        </div>
      )}

      {/* LIST */}
      <h3 className="text-xl font-semibold mb-4">Investments</h3>

      {portfolio.length === 0 ? (
        <p className="text-gray-400">No investments yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolio.map((item, index) => (

            <div
              key={index}
              className="bg-[var(--color-card-bg)] border border-gray-800 p-5 rounded-xl shadow-lg hover:border-gray-600 transition"
            >

              <h4 className="text-lg font-bold mb-3">{item.name}</h4>

              <div className="space-y-2 text-sm">
                <p className="flex justify-between text-gray-300"><span>Total Units:</span> <span className="font-medium text-white">{(item.totalUnits || 0).toFixed(2)}</span></p>

                <p className="flex justify-between text-gray-300"><span>Total Investment:</span> <span className="font-medium text-white">₹{(item.totalInvestment || 0).toFixed(2)}</span></p>

                <p className="flex justify-between text-gray-300"><span>Current Value:</span> <span className="font-medium text-white">₹{(item.currentValue || 0).toFixed(2)}</span></p>

                <p className="flex justify-between pt-2 border-t border-gray-700 font-bold" style={{
                  color: item.profitLoss >= 0 ? "var(--color-brand)" : "#f87171"
                }}>
                  <span>Profit/Loss:</span> <span>₹{(item.profitLoss || 0).toFixed(2)}</span>
                </p>
              </div>

            </div>

          ))}
        </div>
      )}

    </div>

  );

}

export default Portfolio;
import { useEffect, useState } from "react";
import api from "../api/api";
import SummaryCard from "../components/SummaryCard";

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

  const token = localStorage.getItem("token");
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

  }, []);

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

    <div style={{ padding: "20px" }}>

      <h2>Portfolio Dashboard</h2>

      {/* SUMMARY */}
      <div className="flex gap-6 mb-8 flex-wrap">

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
        <div style={{ width: "400px", marginBottom: "30px" }}>
          <h3>Investment Distribution</h3>
          <Pie data={pieChartData} />
        </div>
      )}

      {/* LINE CHART */}
      {transactions.length > 0 && (
        <div style={{ width: "600px", marginBottom: "30px" }}>
          <h3>Portfolio Growth</h3>
          <Line data={lineChartData} />
        </div>
      )}

      {/* LIST */}
      <h3>Investments</h3>

      {portfolio.length === 0 ? (
        <p>No investments yet</p>
      ) : (
        portfolio.map((item, index) => (

          <div
            key={index}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px"
            }}
          >

            <h4>{item.name}</h4>

            <p>Total Units: {(item.totalUnits || 0).toFixed(2)}</p>

            <p>Total Investment: ₹{(item.totalInvestment || 0).toFixed(2)}</p>

            <p>Current Value: ₹{(item.currentValue || 0).toFixed(2)}</p>

            <p style={{
              color: item.profitLoss >= 0 ? "green" : "red",
              fontWeight: "bold"
            }}>
              Profit/Loss: ₹{(item.profitLoss || 0).toFixed(2)}
            </p>

          </div>

        ))
      )}

    </div>

  );

}

export default Portfolio;
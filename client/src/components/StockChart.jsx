import { useEffect, useState } from "react";
import api from "../api/api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function StockChart({ symbol }) {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/market/history/${symbol}`);
        setDataPoints(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, [symbol]);

  const chartData = {
    labels: dataPoints.map(d => d.date),
    datasets: [
      {
        label: `${symbol} Price`,
        data: dataPoints.map(d => d.close),
        borderColor: "#61f2a0",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(97, 242, 160, 0.4)");
          gradient.addColorStop(1, "rgba(97, 242, 160, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: "#61f2a0",
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 21, 32, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#2a3147',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#6b7280', maxTicksLimit: 6 }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
        ticks: { display: false }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="h-64 w-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

export default StockChart;
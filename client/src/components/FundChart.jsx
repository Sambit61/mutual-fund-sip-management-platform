import { useEffect, useState } from "react";
import api from "../api/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function FundChart({ amfiCode }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(
          `/funds/history/${amfiCode}`
        );

        // oldest → newest
        setHistory(
          res.data.reverse()
        );

      } catch (err) {
        console.error(
          "Fund history error:",
          err
        );
      }
    };

    if (amfiCode) {
      fetchHistory();
    }

  }, [amfiCode]);

  const chartData = {
    labels: history.map(
      item => item.date
    ),

    datasets: [
      {
        label: "NAV",
        data: history.map(
          item => item.nav
        ),

        borderColor: "#61f2a0",

        backgroundColor:
          "rgba(97,242,160,0.2)",

        fill: true,

        tension: 0.4,

        pointRadius: 0
      }
    ]
  };

  return (
    <div className="h-72">
      <Line data={chartData} />
    </div>
  );
}

export default FundChart;
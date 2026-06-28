import { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import api from "../api/api";

function CandlestickChart({ symbol }) {
  const chartContainerRef = useRef();
  const [range, setRange] = useState("3mo");

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 350,

      layout: {
        background: {
          color: "#1E293B",
        },
        textColor: "#D1D5DB",
      },

      grid: {
        vertLines: {
          color: "#374151",
        },
        horzLines: {
          color: "#374151",
        },
      },

      crosshair: {
        mode: 0,
      },

      rightPriceScale: {
        borderColor: "#4B5563",
      },

      timeScale: {
        borderColor: "#4B5563",
      },
    });

    const candlestickSeries = chart.addCandlestickSeries();
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: {
        type: "volume",
      },

      priceScaleId: "",
    });
    const fetchCandles = async () => {
      try {
        const res = await api.get(`/market/candles/${symbol}?range=${range}`);

        const formatted = res.data.map((item) => ({
          time: item.date.split("T")[0],

          open: item.open,

          high: item.high,

          low: item.low,

          close: item.close,

volume: item.volume
        }));

        candlestickSeries.setData(formatted);
        volumeSeries.setData(
          formatted.map((item) => ({
            time: item.time,

            value: item.volume,

            color: item.close >= item.open ? "#22c55e" : "#ef4444",
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchCandles();

    return () => chart.remove();
  }, [symbol, range]);

  <div className="flex gap-2 mb-4">
    {[
      {
        label: "1M",
        value: "1mo",
      },
      {
        label: "3M",
        value: "3mo",
      },
      {
        label: "6M",
        value: "6mo",
      },
      {
        label: "1Y",
        value: "1y",
      },
    ].map((item) => (
      <button
        key={item.value}
        onClick={() => setRange(item.value)}
        className={`px-3 py-1 rounded-lg text-sm transition ${
          range === item.value
            ? "bg-brand text-black"
            : "bg-gray-700 text-gray-300"
        }`}
      >
        {item.label}
      </button>
    ))}
  </div>;

  return (
    <>
      <div className="flex gap-2 mb-4">
        {[
          { label: "1M", value: "1mo" },
          { label: "3M", value: "3mo" },
          { label: "6M", value: "6mo" },
          { label: "1Y", value: "1y" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setRange(item.value)}
            className={`px-3 py-1 rounded-lg text-sm transition ${
              range === item.value
                ? "bg-brand text-black"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div ref={chartContainerRef} className="w-full" />
    </>
  );
}

export default CandlestickChart;

import { useState, useEffect } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function SIPCalculator() {

  const [monthlySip, setMonthlySip] =
    useState(5000);

  const [years, setYears] =
    useState(10);

  const [returnRate, setReturnRate] =
    useState(12);

  const [result, setResult] =
    useState(null);

    const pieData =
    result
      ? [
          {
            name: "Invested Amount",
            value:
              result.investedAmount
          },
          {
            name: "Returns",
            value:
              result.wealthGained
          }
        ]
      : [];
  
  const COLORS = [
    "#61F2A0",
    "#3B82F6"
  ];

  const calculateSIP = () => {

    const P = monthlySip;

    const n = years * 12;

    const r =
      returnRate / 12 / 100;

    const maturityValue =
      P *
      (
        (
          Math.pow(
            1 + r,
            n
          ) - 1
        ) / r
      ) *
      (1 + r);

    const investedAmount =
      P * n;

    const wealthGained =
      maturityValue -
      investedAmount;

    setResult({
      investedAmount,
      wealthGained,
      maturityValue
    });

  };

  useEffect(() => {

    calculateSIP();

  }, [
    monthlySip,
    years,
    returnRate
  ]);

  return (

    <div className="min-h-screen p-8 text-white">
  
      <div className="max-w-7xl mx-auto">
  
        <h1 className="text-4xl font-bold mb-8">
          SIP Calculator
        </h1>
  
        <div className="grid md:grid-cols-2 gap-8">
  
          {/* LEFT SIDE */}
  
          <div className="bg-[var(--color-card-bg)] p-8 rounded-xl">
  
            <h2 className="text-2xl font-bold mb-8">
              Investment Details
            </h2>
  
            <div className="mb-8">
  
              <label className="block mb-2">
                Monthly SIP ₹
                {monthlySip.toLocaleString()}
              </label>
  
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={monthlySip}
                onChange={(e) =>
                  setMonthlySip(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full"
              />
  
            </div>
  
            <div className="mb-8">
  
              <label className="block mb-2">
                Investment Period
                {" "}
                {years}
                {" "}
                Years
              </label>
  
              <input
                type="range"
                min="1"
                max="30"
                value={years}
                onChange={(e) =>
                  setYears(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full"
              />
  
            </div>
  
            <div>
  
              <label className="block mb-2">
                Expected Return
                {" "}
                {returnRate}
                %
              </label>
  
              <input
                type="range"
                min="1"
                max="20"
                value={returnRate}
                onChange={(e) =>
                  setReturnRate(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full"
              />
  
            </div>
  
          </div>
  
          {/* RIGHT SIDE */}
  
          <div className="bg-[var(--color-card-bg)] p-8 rounded-xl">
  
            <h2 className="text-2xl font-bold mb-6">
              SIP Results
            </h2>
  
            {result && (
  
              <>
  
  <div className="h-80 relative">

<ResponsiveContainer
  width="100%"
  height="100%"
>

  <PieChart>

    <Pie
      data={pieData}
      cx="50%"
      cy="50%"
      innerRadius={70}
      outerRadius={110}
      paddingAngle={4}
      dataKey="value"
    >

      {pieData.map(
        (entry, index) => (

          <Cell
            key={index}
            fill={
              COLORS[index]
            }
          />

        )
      )}

    </Pie>

    <Tooltip
      formatter={(value) =>
        `₹${Math.round(
          value
        ).toLocaleString()}`
      }
    />

  </PieChart>

</ResponsiveContainer>

<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

  <p className="text-gray-400 text-sm">
    Maturity Value
  </p>

  <h3 className="text-2xl font-bold text-brand">
    ₹
    {Math.round(
      result.maturityValue
    ).toLocaleString()}
  </h3>

</div>

</div>

<div className="flex justify-center gap-8 mt-4">

<div className="flex items-center gap-2">

  <div className="w-4 h-4 rounded-full bg-green-400"></div>

  <span>
    Invested Amount
  </span>

</div>

<div className="flex items-center gap-2">

  <div className="w-4 h-4 rounded-full bg-blue-500"></div>

  <span>
    Returns
  </span>

</div>

</div>
  
                <div className="space-y-6 mt-8">
  
                  <div>
  
                    <p className="text-gray-400">
                      Invested Amount
                    </p>
  
                    <h3 className="text-2xl font-bold">
                      ₹
                      {Math.round(
                        result.investedAmount
                      ).toLocaleString()}
                    </h3>
  
                  </div>
  
                  <div>
  
                    <p className="text-gray-400">
                      Wealth Gained
                    </p>
  
                    <h3 className="text-2xl font-bold text-green-400">
                      ₹
                      {Math.round(
                        result.wealthGained
                      ).toLocaleString()}
                    </h3>
  
                  </div>
  
                  <div>
  
                    <p className="text-gray-400">
                      Maturity Value
                    </p>
  
                    <h3 className="text-2xl font-bold text-brand">
                      ₹
                      {Math.round(
                        result.maturityValue
                      ).toLocaleString()}
                    </h3>
  
                  </div>
  
                </div>
  
              </>
  
            )}
  
          </div>
  
        </div>
  
      </div>
  
    </div>
  
  );

}

export default SIPCalculator;
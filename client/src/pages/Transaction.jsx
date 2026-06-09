import { useEffect, useState } from "react";
import api from "../api/api";

function Transactions() {

  const [transactions, setTransactions] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {

    const fetchTransactions = async () => {

      try {

        const res = await api.get("/transactions/my", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Transactions:", res.data);

        setTransactions(res.data || []);

      } catch (err) {
        console.error(err);
      }

    };

    fetchTransactions();

  }, [token]);

  return (

    <div className="p-4 md:p-8 max-w-4xl mx-auto text-white">

      <h2 className="text-2xl md:text-3xl font-bold mb-6">Your Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-400">No transactions yet</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((txn) => (
            <div
              key={txn._id}
              className="bg-[var(--color-card-bg)] border border-gray-800 p-5 rounded-xl shadow hover:border-gray-600 transition flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            >

              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">
                  {txn.assetType === "STOCK"
                    ? txn.symbol
                    : txn.fund?.fundName || "Unknown Fund"}
                </h3>
                <p className="text-sm text-gray-400">
                  {new Date(txn.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-2 md:flex gap-4 md:gap-8 text-sm w-full md:w-auto">
                <div>
                  <p className="text-gray-500 mb-1">Type</p>
                  <p className={`font-semibold ${txn.type === "BUY" ? "text-brand" : "text-red-400"}`}>
                    {txn.type}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Amount</p>
                  <p className="font-semibold text-white">₹{(txn.amount || 0).toFixed(2)}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-gray-500 mb-1">Units</p>
                  <p className="font-semibold text-white">{(txn.units || 0).toFixed(2)}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>

  );

}

export default Transactions;
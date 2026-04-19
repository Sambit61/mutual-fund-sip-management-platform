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

  }, []);

  return (

    <div style={{ padding: "20px" }}>

      <h2>Your Transactions</h2>

      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        transactions.map((txn) => (

          <div
            key={txn._id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              margin: "10px",
              borderRadius: "8px"
            }}
          >

            <h3>
              {txn.assetType === "STOCK"
                ? txn.symbol
                : txn.fund?.fundName || "Unknown Fund"}
            </h3>

            <p>Type: {txn.type}</p>

            <p>Amount: ₹{(txn.amount || 0).toFixed(2)}</p>

            <p>Units: {(txn.units || 0).toFixed(2)}</p>

            <p>
              Date: {new Date(txn.createdAt).toLocaleDateString()}
            </p>

          </div>

        ))
      )}

    </div>

  );

}

export default Transactions;
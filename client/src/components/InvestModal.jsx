import { useState } from "react";
import api from "../api/api";

function InvestModal({ fund, closeModal }) {

  const [amount, setAmount] = useState("");

  const token = localStorage.getItem("token");

  const handleInvest = async () => {

    if (!amount) {
      alert("Enter amount");
      return;
    }

    try {

      await api.post(
        "/transactions/buy",
        {
          fundId: fund._id,
          amount: Number(amount)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Investment successful");

      closeModal();

    } catch (err) {
      console.error(err);
      alert("Investment failed");
    }
  };

  return (

    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

      <div className="bg-white rounded-lg p-6 w-96">

        <h2 className="text-xl font-bold mb-4">
          Invest in {fund.fundName}
        </h2>

        <p className="text-gray-500 mb-4">
          NAV: ₹{fund.nav}
        </p>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full rounded mb-4"
        />

        <div className="flex gap-3">

          <button
            onClick={handleInvest}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          >
            Confirm Investment
          </button>

          <button
            onClick={closeModal}
            className="bg-gray-300 px-4 py-2 rounded w-full"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>

  );
}

export default InvestModal;
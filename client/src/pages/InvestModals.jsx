import { useState } from "react";
import api from "../api/api";

function InvestModal({ fund, closeModal }) {

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {

    // ✅ Validate amount
    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    // ✅ Check Razorpay script
    if (!window.Razorpay) {
      alert("Payment SDK not loaded. Refresh page.");
      return;
    }

    try {

      setLoading(true);

      console.log("Creating order with amount:", amount);

      // 🔹 Step 1: Create order from backend
      const { data } = await api.post("/payment/create-order", {
        amount: Number(amount)
      });

      console.log("Order created:", data);

      // 🔹 Step 2: Razorpay options
      const options = {
        key: "rzp_test_SeeCx0Nv1Ort7K", // ✅ your KEY_ID
        amount: data.amount,
        currency: "INR",
        name: "MUTUALSIP",
        description: fund.fundName,
        order_id: data.id,

        handler: async function () {

          try {

            const token = localStorage.getItem("token");

            // 🔹 Save transaction after payment
            await api.post(
              "/transactions/buy",
              {
                fundId: fund._id,
                amount: Number(amount),
                assetType: "FUND"
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
            console.error("Transaction error:", err);
            alert("Payment done but saving failed");
          }

        },

        prefill: {
          name: "User",
          email: "test@example.com"
        },

        theme: {
          color: "#61f2a0" // brand color
        }
      };

      // 🔹 Step 3: Open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {

      console.error("Payment Error:", err);
      console.log("Response:", err.response?.data);

      alert(err.response?.data?.message || "Order creation failed");

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">

      <div className="bg-[var(--color-card-bg)] border border-gray-800 p-6 rounded-xl w-80 shadow-2xl relative">

        <h2 className="text-xl font-bold mb-2 text-white">
          Invest in {fund.fundName}
        </h2>

        <p className="text-sm text-brand font-medium mb-6">
          NAV: ₹{fund.nav}
        </p>

        <input
          type="number"
          placeholder="Enter amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-[var(--color-bg-main)] border border-gray-700 p-3 w-full mb-6 rounded-lg text-white focus:outline-none focus:border-brand placeholder-gray-500"
        />

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 font-bold rounded-lg mb-3 transition ${
            loading
              ? "bg-gray-600 text-gray-300"
              : "bg-brand hover:bg-brand-dark text-gray-900 hover:text-white"
          }`}
        >
          {loading ? "Processing..." : "Pay & Invest"}
        </button>

        <button
          onClick={closeModal}
          className="w-full bg-[var(--color-card-bg-light)] hover:bg-gray-700 text-white font-medium py-3 rounded-lg transition"
        >
          Cancel
        </button>

      </div>

    </div>

  );

}

export default InvestModal;
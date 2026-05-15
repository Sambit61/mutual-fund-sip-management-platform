import { useState } from "react";
import api from "../api/api";

const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

function InvestModal({ fund, closeModal }) {

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {

    // ✅ Validation
    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    // ✅ Razorpay SDK check
    if (!window.Razorpay) {
      console.error("Razorpay SDK missing");
      alert("Payment SDK not loaded. Refresh page.");
      return;
    }

    // ✅ Razorpay key check
    if (!razorpayKeyId) {
      console.error("Razorpay key missing");
      alert("Payment configuration missing.");
      return;
    }

    try {

      setLoading(true);

      console.log("STEP 1: Starting payment");

      // ✅ Create order
      const { data } = await api.post(
        "/payment/create-order",
        {
          amount: Number(amount)
        }
      );

      console.log("STEP 2: Order created", data);

      // ✅ Razorpay options
      const options = {

        key: razorpayKeyId,

        amount: data.amount,

        currency: "INR",

        name: "MUTUALSIP",

        description: fund.fundName,

        order_id: data.id,

        handler: async function (response) {

          console.log("STEP 6: Payment success", response);

          try {

            const token = localStorage.getItem("token");

            console.log("STEP 7: Saving transaction");

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

            console.log("STEP 8: Transaction saved");

            alert("Investment successful");

            closeModal();

          } catch (err) {

            console.error("TRANSACTION ERROR:", err);

            alert("Payment successful but transaction save failed");

          }

        },

        modal: {
          ondismiss: function () {
            console.log("Razorpay popup closed");
          }
        },

        prefill: {
          name: "User",
          email: "test@example.com"
        },

        theme: {
          color: "#61f2a0"
        }

      };

      console.log("STEP 3: Razorpay available?", window.Razorpay);

      console.log("STEP 4: Razorpay options", options);

      // ✅ Create Razorpay instance
      const rzp = new window.Razorpay(options);

      console.log("STEP 5: Opening Razorpay");

      // ✅ Open popup
      rzp.open();

    } catch (err) {

      console.error("PAYMENT ERROR:", err);

      console.log("ERROR RESPONSE:", err.response?.data);

      alert(
        err.response?.data?.message ||
        err.message ||
        "Order creation failed"
      );

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
          NAV: Rs.{fund.nav}
        </p>

        <input
          type="number"
          placeholder="Enter amount (Rs.)"
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
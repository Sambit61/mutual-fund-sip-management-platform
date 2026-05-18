import { useState } from "react";
import api from "../api/api";

const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

function StockInvestModal({ stock, closeModal }) {

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {

    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {

      setLoading(true);

      // CREATE ORDER
      const { data } = await api.post(
        "/payment/create-order",
        {
          amount: Number(amount)
        }
      );

      const options = {

        key: razorpayKeyId,

        amount: data.amount,

        currency: "INR",

        name: "MUTUALSIP",

        description: `Invest in ${stock.symbol}`,

        order_id: data.id,

        handler: async function () {

          try {

            const token = localStorage.getItem("token");

            await api.post(
              "/transactions/buy",
              {
                stockSymbol: stock.symbol,
                amount: Number(amount),
                assetType: "STOCK"
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            alert("Stock Investment Successful");

            closeModal();

          } catch (err) {

            console.error(err);

            alert("Payment successful but transaction failed");

          }

        },

        theme: {
          color: "#61f2a0"
        }

      };

      const rzp = new window.Razorpay(options);

      rzp.open();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Payment failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">

      <div className="bg-[#111827] p-6 rounded-xl w-80">

        <h2 className="text-xl font-bold text-white mb-3">
          Invest in {stock.symbol}
        </h2>

        <p className="text-green-400 mb-4">
          Current Price: ${stock.price}
        </p>

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white mb-4"
        />

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-green-400 hover:bg-green-500 text-black font-bold py-3 rounded mb-3"
        >
          {loading ? "Processing..." : "Pay & Invest"}
        </button>

        <button
          onClick={closeModal}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded"
        >
          Cancel
        </button>

      </div>

    </div>

  );

}

export default StockInvestModal;
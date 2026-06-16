import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await api.post(
        "/auth/forgot-password",
        {
          email
        }
      );

      toast.success(
        res.data.message
      );

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to send reset link"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-[85vh] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[var(--color-card-bg)] rounded-xl p-8 border border-gray-800">

        <h2 className="text-3xl font-bold text-white mb-2">
          Forgot Password
        </h2>

        <p className="text-gray-400 mb-6">
          Enter your email to receive a reset link
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full px-4 py-3 mb-4 bg-white text-black rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-black py-3 rounded-lg font-bold"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

        </form>

        <button
          onClick={() =>
            navigate("/login")
          }
          className="mt-4 text-brand"
        >
          Back to Login
        </button>

      </div>

    </div>

  );

}

export default ForgotPassword;
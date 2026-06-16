import { useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../api/api";

function ResetPassword() {

  const navigate =
    useNavigate();

  const { token } =
    useParams();

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      password !==
      confirmPassword
    ) {

      toast.error(
        "Passwords do not match"
      );

      return;

    }

    try {

      setLoading(true);

      const res =
        await api.post(
          `/auth/reset-password/${token}`,
          {
            password
          }
        );

      toast.success(
        res.data.message
      );

      navigate("/login");

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Reset failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-[85vh] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[var(--color-card-bg)] rounded-xl p-8 border border-gray-800">

        <h2 className="text-3xl font-bold text-white mb-2">
          Reset Password
        </h2>

        <p className="text-gray-400 mb-6">
          Enter your new password
        </p>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full px-4 py-3 mb-4 bg-white text-black rounded-lg"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full px-4 py-3 mb-4 bg-white text-black rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-black py-3 rounded-lg font-bold"
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>

      </div>

    </div>

  );

}

export default ResetPassword;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";

import api from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Registration successful");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[var(--color-card-bg)] rounded-xl shadow-2xl p-8 sm:p-10 border border-gray-800/60 text-center">
        <h2 className="text-3xl font-bold text-[var(--color-brand)] mb-2 tracking-tight">
          MutualSIP
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          Secure your financial future today.
        </p>

        <form onSubmit={handleRegister} className="text-left">
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-all placeholder-gray-400 font-medium"
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-all placeholder-gray-400 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-all placeholder-gray-400 font-medium tracking-widest text-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2 whitespace-nowrap">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-all placeholder-gray-400 font-medium tracking-widest text-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[var(--color-brand)] hover:bg-[#4de68a] text-gray-900 font-bold text-base rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(97,242,160,0.2)] hover:shadow-[0_0_20px_rgba(97,242,160,0.4)] flex items-center justify-center gap-2"
          >
            {loading ? "Creating Account..." : "Create Account"}
            {!loading && <ArrowRight size={20} className="stroke-[2.5px]" />}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-white font-bold cursor-pointer hover:underline ml-1"
          >
            Login
          </span>
        </p>
      </div>

      <div className="mt-12 text-xs font-semibold text-gray-600/70">
        © 2024 MutualSIP Financial Services
      </div>
    </div>
  );
}

export default Register;
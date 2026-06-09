import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

import api from "../api/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
//AUTHCONTEXT 
      login(
        res.data.token,
        res.data.role
      );
      
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[var(--color-card-bg)] rounded-xl shadow-2xl p-8 sm:p-10 border border-gray-800/60">
        <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
        <p className="text-gray-400 text-sm mb-8">
          Access your mutual fund portfolio
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email address
            </label>
            <input
              type="email"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-all placeholder-blue-300/70 font-medium"
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <span
                onClick={() => toast("Forgot password feature coming soon")}
                className="text-sm font-medium text-[var(--color-brand)] cursor-pointer hover:underline"
              >
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-all placeholder-blue-300/70 font-medium pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[var(--color-brand)] hover:bg-[#4de68a] text-gray-900 font-bold text-base rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(97,242,160,0.2)] hover:shadow-[0_0_20px_rgba(97,242,160,0.4)] mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-gray-700/50"></div>
          <span className="mx-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Or continue with
          </span>
          <div className="flex-grow border-t border-gray-700/50"></div>
        </div>

        <p className="text-center text-sm text-gray-400">
          New to Mutual Sip?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[var(--color-brand)] font-medium cursor-pointer hover:underline ml-1"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
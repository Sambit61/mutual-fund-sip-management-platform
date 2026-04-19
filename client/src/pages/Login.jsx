import { useState } from "react";
import api from "../api/api";

function Login({ setToken, setPage }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {

      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setPage("dashboard");

      // Optional: replace alert with toast in future
      // alert("Login successful");

    } catch (err) {
      alert("Login failed");
    }
  };

  return (

    <div className="p-6">

      <h2 className="text-xl mb-4">Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 block mb-3"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 block mb-3"
      />

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>

      <div className="mt-3">
        <span
          className="text-blue-600 text-sm cursor-pointer block mb-2"
          onClick={() => alert("Forgot password functionality coming soon!")}
        >
          Forgot password?
        </span>
      </div>

      {/* 🔹 REGISTER LINK */}
      <p className="mt-3 text-sm">
        Don’t have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => setPage("register")}
        >
          Register
        </span>
      </p>

    </div>

  );

}

export default Login;
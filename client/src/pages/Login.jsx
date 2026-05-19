import { useState } from "react";
import api from "../api/api";

function Login({ setToken, setPage }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await api.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      // ✅ Store token
      localStorage.setItem(
        "token",
        res.data.token
      );

      // ✅ Store role
      localStorage.setItem(
        "role",
        res.data.role
      );

      // ✅ Update app state
      setToken(res.data.token);

      // ✅ Redirect
      setPage("dashboard");

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Login failed"
      );

    }

  };

  return (

    <div className="p-6">

      <h2 className="text-xl mb-4">
        Login
      </h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 block mb-3 w-full"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 block mb-3 w-full"
      />

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Login
      </button>

      {/* Forgot password */}

      <div className="mt-3">

        <span
          className="text-blue-600 text-sm cursor-pointer block mb-2"
          onClick={() =>
            alert(
              "Forgot password functionality coming soon!"
            )
          }
        >
          Forgot password?
        </span>

      </div>

      {/* Register */}

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
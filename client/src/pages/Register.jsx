import { useState } from "react";
import api from "../api/api";

function Register({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", { name, email, password });
      alert("Registration successful");
      setPage("login"); // go back to login after register
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Register</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 block mb-3"
      />

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
        onClick={handleRegister}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Register
      </button>

      <div className="mt-3">
        <span
          className="text-blue-600 text-sm cursor-pointer block mb-2"
          onClick={() => alert("Forgot password functionality coming soon!")}
        >
          Forgot password?
        </span>
      </div>

      <p className="mt-3 text-sm">
        Already have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => setPage("login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Register;
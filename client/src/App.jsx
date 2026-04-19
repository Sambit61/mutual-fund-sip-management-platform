import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Funds from "./pages/Funds";
import Portfolio from "./pages/Portfolio";
import Transactions from "./pages/Transaction";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";

function App() {

  const [page, setPage] = useState("landing"); // ✅ start with landing
  const [token, setToken] = useState(localStorage.getItem("token"));

  // ✅ INACTIVITY LOGOUT (only when logged in)
  useEffect(() => {

    if (!token) return; // 🔴 important

    let timeout;

    const logoutUser = () => {
      localStorage.removeItem("token");
      setToken(null);
      setPage("login"); // redirect to login
      alert("Logged out due to inactivity");
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logoutUser, 600000); // 10 minutes
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };

  }, [token]);

  return (

    <div>

      <Navbar setPage={setPage} token={token} setToken={setToken} />

      {/* 🔹 NOT LOGGED IN */}
      {!token ? (

        page === "register" ? (
          <Register setPage={setPage} />
        ) : page === "login" ? (
          <Login setToken={setToken} setPage={setPage} />
        ) : (
          <Landing setPage={setPage} />
        )

      ) : (

        /* 🔹 LOGGED IN */
        <div>
          {page === "dashboard" && <Dashboard />}
          {page === "funds" && <Funds />}
          {page === "portfolio" && <Portfolio />}
          {page === "transactions" && <Transactions />}
        </div>

      )}

    </div>

  );

}

export default App;
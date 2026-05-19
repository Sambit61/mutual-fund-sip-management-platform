import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Funds from "./pages/Funds";
import Portfolio from "./pages/Portfolio";
import Transactions from "./pages/Transaction";
import AdminDashboard from "./pages/AdminDashboard";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";

function App() {

  const [page, setPage] = useState("landing");

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const role = localStorage.getItem("role");

  // ✅ AUTO LOGOUT

  useEffect(() => {

    if (!token) return;

    let timeout;

    const logoutUser = () => {

      localStorage.removeItem("token");

      localStorage.removeItem("role");

      setToken(null);

      setPage("login");

      alert("Logged out due to inactivity");

    };

    const resetTimer = () => {

      clearTimeout(timeout);

      timeout = setTimeout(
        logoutUser,
        600000 // 10 mins
      );

    };

    window.addEventListener(
      "mousemove",
      resetTimer
    );

    window.addEventListener(
      "keydown",
      resetTimer
    );

    window.addEventListener(
      "click",
      resetTimer
    );

    resetTimer();

    return () => {

      clearTimeout(timeout);

      window.removeEventListener(
        "mousemove",
        resetTimer
      );

      window.removeEventListener(
        "keydown",
        resetTimer
      );

      window.removeEventListener(
        "click",
        resetTimer
      );

    };

  }, [token]);

  return (

    <div>

      <Navbar
        setPage={setPage}
        token={token}
        setToken={setToken}
      />

      {/* NOT LOGGED IN */}

      {!token ? (

        page === "register" ? (

          <Register setPage={setPage} />

        ) : page === "login" ? (

          <Login
            setToken={setToken}
            setPage={setPage}
          />

        ) : (

          <Landing setPage={setPage} />

        )

      ) : (

        /* LOGGED IN */

        <div>

          {page === "dashboard" && (
            <Dashboard />
          )}

          {page === "funds" && (
            <Funds />
          )}

          {page === "portfolio" && (
            <Portfolio />
          )}

          {page === "transactions" && (
            <Transactions />
          )}

          {/* ✅ ADMIN PAGE */}

          {page === "admin" &&
            role === "admin" && (
              <AdminDashboard />
          )}

        </div>

      )}

    </div>

  );

}

export default App;
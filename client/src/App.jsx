import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminRoute from "./routes/AdminRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Funds from "./pages/Funds";
import Portfolio from "./pages/Portfolio";
import Transactions from "./pages/Transaction";

import AdminDashboard from "./pages/AdminDashboard";

import ForgotPassword from "./pages/ForgotPassword";

import ResetPassword from "./pages/ResetPassword";

import Profile from "./pages/Profile";

import SIPCalculator from "./pages/SIPCalculator";

import Stocks from "./pages/Stocks";

import Watchlist from "./pages/Watchlist";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        {/* PUBLIC */}

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* USER */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/funds"
          element={
            <ProtectedRoute>
              <Funds />
            </ProtectedRoute>
          }
        />

        <Route path="/stocks" element={<Stocks />} />

        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/sip-calculator" element={<SIPCalculator />} />

        <Route path="/watchlist" element={<Watchlist />} />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

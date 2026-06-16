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

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        {/* PUBLIC */}

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
<Route
  path="/reset-password/:token"
  element={<ResetPassword />}
/>

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
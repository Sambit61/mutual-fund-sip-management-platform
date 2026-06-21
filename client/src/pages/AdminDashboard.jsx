import { useState, useEffect } from "react";
import api from "../api/api";
import AdminSidebar from "../components/admin/AdminSidebar";
import FundManager from "../components/admin/FundManager";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function AdminDashboard() {
  const { token } = useAuth();

  // ✅ FORM STATES

  // ✅ DATA STATES

  const [funds, setFunds] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);

  // ✅ ACTIVE SIDEBAR SECTION

  const [activeSection, setActiveSection] = useState("dashboard");

  // ✅ ADMIN STATS

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFunds: 0,
    totalTransactions: 0,
    totalInvestmentAmount: 0,
  });

  // ✅ EDIT STATES

  // ✅ FETCH FUNDS

  const fetchFunds = async () => {
    try {
      const res = await api.get("/funds");

      setFunds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FETCH ADMIN STATS

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FETCH TRANSACTIONS

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/admin/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FETCH USERS

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ MAKE ADMIN

  const handleMakeAdmin = async (id) => {
    try {
      await api.put(
        `/admin/make-admin/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("User promoted to admin");

      fetchUsers();
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };
  // ✅ LOAD DATA

  useEffect(() => {
    fetchFunds();

    fetchStats();

    fetchTransactions();

    fetchUsers();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex">
      {/* SIDEBAR */}

      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      {/* MAIN CONTENT */}

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* DASHBOARD */}

        {activeSection === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
              <h3 className="text-gray-400 text-sm mb-2">Total Users</h3>

              <p className="text-3xl font-bold text-green-400">
                {stats.totalUsers}
              </p>
            </div>

            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
              <h3 className="text-gray-400 text-sm mb-2">Total Funds</h3>

              <p className="text-3xl font-bold text-blue-400">
                {stats.totalFunds}
              </p>
            </div>

            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
              <h3 className="text-gray-400 text-sm mb-2">Total Transactions</h3>

              <p className="text-3xl font-bold text-yellow-400">
                {stats.totalTransactions}
              </p>
            </div>

            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
              <h3 className="text-gray-400 text-sm mb-2">Total Investments</h3>

              <p className="text-3xl font-bold text-purple-400">
                ₹{stats.totalInvestmentAmount}
              </p>
            </div>
          </div>
        )}

        {/* FUNDS */}

        {activeSection === "funds" && (
          <FundManager
            funds={funds}
            fetchFunds={fetchFunds}
            fetchStats={fetchStats}
          />
        )}

        {/* TRANSACTIONS */}

        {activeSection === "transactions" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>

            <div className="bg-[#111827] rounded-xl overflow-hidden border border-gray-800">
              <table className="w-full text-left">
                <thead className="bg-gray-900 text-gray-400">
                  <tr>
                    <th className="p-4">Asset Type</th>

                    <th className="p-4">Amount</th>

                    <th className="p-4">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="border-t border-gray-800">
                      <td className="p-4">{tx.assetType}</td>

                      <td className="p-4 text-green-400">₹{tx.amount}</td>

                      <td className="p-4 text-gray-400">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS */}

        {activeSection === "users" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Platform Users</h2>

            <div className="bg-[#111827] rounded-xl overflow-hidden border border-gray-800">
              <table className="w-full text-left">
                <thead className="bg-gray-900 text-gray-400">
                  <tr>
                    <th className="p-4">Name</th>

                    <th className="p-4">Email</th>

                    <th className="p-4">Role</th>

                    <th className="p-4">Joined</th>

                    <th className="p-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-t border-gray-800">
                      <td className="p-4">{user.name}</td>

                      <td className="p-4 text-gray-300">{user.email}</td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            user.role === "admin"
                              ? "bg-red-500 text-white"
                              : "bg-green-500 text-black"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="p-4 text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleMakeAdmin(user._id)}
                            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
                          >
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

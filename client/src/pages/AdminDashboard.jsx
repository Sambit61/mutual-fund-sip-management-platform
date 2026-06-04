import { useState, useEffect } from "react";
import api from "../api/api";

function AdminDashboard() {

  // ✅ FORM STATES

  const [fundName, setFundName] = useState("");
  const [fundCode, setFundCode] = useState("");
  const [category, setCategory] = useState("");
  const [nav, setNav] = useState("");

  // ✅ DATA STATES

  const [funds, setFunds] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);

  // ✅ ACTIVE SIDEBAR SECTION

  const [activeSection, setActiveSection] =
    useState("dashboard");

  // ✅ ADMIN STATS

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFunds: 0,
    totalTransactions: 0,
    totalInvestmentAmount: 0
  });

  // ✅ EDIT STATES

  const [editingId, setEditingId] = useState(null);

  const [editNav, setEditNav] = useState("");

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

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/admin/stats",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setStats(res.data);

    } catch (err) {

      console.error(err);

    }

  };

  // ✅ FETCH TRANSACTIONS

  const fetchTransactions = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/admin/transactions",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setTransactions(res.data);

    } catch (err) {

      console.error(err);

    }

  };

  // ✅ FETCH USERS

  const fetchUsers = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/admin/users",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setUsers(res.data);

    } catch (err) {

      console.error(err);

    }

  };

  // ✅ MAKE ADMIN

  const handleMakeAdmin = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      await api.put(
        `/admin/make-admin/${id}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      alert(
        "User promoted to admin"
      );

      fetchUsers();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to update role"
      );

    }

  };

  // ✅ ADD FUND

  const handleAddFund = async () => {

    try {

      const token =
        localStorage.getItem("token");

      await api.post(
        "/funds",
        {
          fundName,
          fundCode,
          category,
          nav
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      alert(
        "Fund added successfully"
      );

      setFundName("");
      setFundCode("");
      setCategory("");
      setNav("");

      fetchFunds();

      fetchStats();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to add fund"
      );

    }

  };

  // ✅ DELETE FUND

  const handleDeleteFund = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      await api.delete(
        `/funds/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      alert("Fund deleted");

      fetchFunds();

      fetchStats();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Delete failed"
      );

    }

  };

  // ✅ UPDATE NAV

  const handleUpdateFund = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      await api.put(
        `/funds/${id}`,
        {
          nav: editNav
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      alert(
        "NAV updated successfully"
      );

      setEditingId(null);

      setEditNav("");

      fetchFunds();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Update failed"
      );

    }

  };

  // ✅ LOAD DATA

  useEffect(() => {

    fetchFunds();

    fetchStats();

    fetchTransactions();

    fetchUsers();

  }, []);

  return (

    <div className="min-h-screen bg-[#0b1120] text-white flex">

      {/* SIDEBAR */}

      <div className="w-64 bg-[#111827] p-6 border-r border-gray-800">

        <h1 className="text-2xl font-bold text-green-400 mb-10">
          Admin Panel
        </h1>

        <div className="space-y-4">

          <button
            onClick={() =>
              setActiveSection("dashboard")
            }
            className={`block w-full text-left px-4 py-3 rounded ${
              activeSection === "dashboard"
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              setActiveSection("funds")
            }
            className={`block w-full text-left px-4 py-3 rounded ${
              activeSection === "funds"
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
            Manage Funds
          </button>

          <button
            onClick={() =>
              setActiveSection("transactions")
            }
            className={`block w-full text-left px-4 py-3 rounded ${
              activeSection === "transactions"
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
            Transactions
          </button>

          <button
            onClick={() =>
              setActiveSection("users")
            }
            className={`block w-full text-left px-4 py-3 rounded ${
              activeSection === "users"
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
            Users
          </button>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 p-8">

        <h1 className="text-3xl font-bold mb-8">
          Admin Dashboard
        </h1>

        {/* DASHBOARD */}

        {activeSection === "dashboard" && (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">

              <h3 className="text-gray-400 text-sm mb-2">
                Total Users
              </h3>

              <p className="text-3xl font-bold text-green-400">
                {stats.totalUsers}
              </p>

            </div>

            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">

              <h3 className="text-gray-400 text-sm mb-2">
                Total Funds
              </h3>

              <p className="text-3xl font-bold text-blue-400">
                {stats.totalFunds}
              </p>

            </div>

            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">

              <h3 className="text-gray-400 text-sm mb-2">
                Total Transactions
              </h3>

              <p className="text-3xl font-bold text-yellow-400">
                {stats.totalTransactions}
              </p>

            </div>

            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">

              <h3 className="text-gray-400 text-sm mb-2">
                Total Investments
              </h3>

              <p className="text-3xl font-bold text-purple-400">
                ₹{stats.totalInvestmentAmount}
              </p>

            </div>

          </div>

        )}

        {/* FUNDS */}

        {activeSection === "funds" && (

          <>

            <div className="bg-[#111827] p-6 rounded-xl max-w-md mb-10">

              <h2 className="text-xl font-semibold mb-4">
                Add Mutual Fund
              </h2>

              <input
                type="text"
                placeholder="Fund Name"
                value={fundName}
                onChange={(e) =>
                  setFundName(e.target.value)
                }
                className="w-full p-3 mb-3 rounded bg-gray-900 border border-gray-700"
              />

              <input
                type="text"
                placeholder="Fund Code"
                value={fundCode}
                onChange={(e) =>
                  setFundCode(e.target.value)
                }
                className="w-full p-3 mb-3 rounded bg-gray-900 border border-gray-700"
              />

              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full p-3 mb-3 rounded bg-gray-900 border border-gray-700"
              />

              <input
                type="number"
                placeholder="NAV"
                value={nav}
                onChange={(e) =>
                  setNav(e.target.value)
                }
                className="w-full p-3 mb-4 rounded bg-gray-900 border border-gray-700"
              />

              <button
                onClick={handleAddFund}
                className="w-full bg-green-400 hover:bg-green-500 text-black font-bold py-3 rounded"
              >
                Add Fund
              </button>

            </div>

            <div>

              <h2 className="text-2xl font-bold mb-4">
                Manage Funds
              </h2>

              <div className="space-y-4">

                {funds.map((fund) => (

                  <div
                    key={fund._id}
                    className="bg-[#111827] p-4 rounded-xl flex justify-between items-center"
                  >

                    <div>

                      <h3 className="text-lg font-semibold">
                        {fund.fundName}
                      </h3>

                      <p className="text-gray-400">
                        {fund.category}
                      </p>

                      {editingId === fund._id ? (

                        <div className="mt-2 flex gap-2">

                          <input
                            type="number"
                            value={editNav}
                            onChange={(e) =>
                              setEditNav(
                                e.target.value
                              )
                            }
                            className="bg-gray-900 border border-gray-700 p-2 rounded"
                          />

                          <button
                            onClick={() =>
                              handleUpdateFund(
                                fund._id
                              )
                            }
                            className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded"
                          >
                            Save
                          </button>

                        </div>

                      ) : (

                        <p className="text-green-400">
                          NAV: ₹{fund.nav}
                        </p>

                      )}

                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() => {
                          setEditingId(fund._id);
                          setEditNav(fund.nav);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                      >
                        Edit NAV
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteFund(
                            fund._id
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </>

        )}

        {/* TRANSACTIONS */}

        {activeSection === "transactions" && (

          <div>

            <h2 className="text-2xl font-bold mb-4">
              Recent Transactions
            </h2>

            <div className="bg-[#111827] rounded-xl overflow-hidden border border-gray-800">

              <table className="w-full text-left">

                <thead className="bg-gray-900 text-gray-400">

                  <tr>

                    <th className="p-4">
                      Asset Type
                    </th>

                    <th className="p-4">
                      Amount
                    </th>

                    <th className="p-4">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {transactions.map((tx) => (

                    <tr
                      key={tx._id}
                      className="border-t border-gray-800"
                    >

                      <td className="p-4">
                        {tx.assetType}
                      </td>

                      <td className="p-4 text-green-400">
                        ₹{tx.amount}
                      </td>

                      <td className="p-4 text-gray-400">
                        {new Date(
                          tx.createdAt
                        ).toLocaleDateString()}
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

            <h2 className="text-2xl font-bold mb-4">
              Platform Users
            </h2>

            <div className="bg-[#111827] rounded-xl overflow-hidden border border-gray-800">

              <table className="w-full text-left">

                <thead className="bg-gray-900 text-gray-400">

                  <tr>

                    <th className="p-4">
                      Name
                    </th>

                    <th className="p-4">
                      Email
                    </th>

                    <th className="p-4">
                      Role
                    </th>

                    <th className="p-4">
                      Joined
                    </th>

                    <th className="p-4">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {users.map((user) => (

                    <tr
                      key={user._id}
                      className="border-t border-gray-800"
                    >

                      <td className="p-4">
                        {user.name}
                      </td>

                      <td className="p-4 text-gray-300">
                        {user.email}
                      </td>

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
                        {new Date(
                          user.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="p-4">

                        {user.role !== "admin" && (

                          <button
                            onClick={() =>
                              handleMakeAdmin(
                                user._id
                              )
                            }
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
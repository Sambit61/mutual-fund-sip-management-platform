import { useState, useEffect } from "react";
import api from "../api/api";

function AdminDashboard() {

  const [fundName, setFundName] = useState("");
  const [fundCode, setFundCode] = useState("");
  const [category, setCategory] = useState("");
  const [nav, setNav] = useState("");

  const [funds, setFunds] = useState([]);

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

  // ✅ DELETE FUND

  const handleDeleteFund = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await api.delete(
        `/funds/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Fund deleted");

      fetchFunds();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Delete failed"
      );

    }

  };

  // ✅ UPDATE FUND NAV

  const handleUpdateFund = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await api.put(
        `/funds/${id}`,
        {
          nav: editNav
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("NAV updated successfully");

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

  // ✅ ADD FUND

  const handleAddFund = async () => {

    try {

      const token = localStorage.getItem("token");

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
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Fund added successfully");

      setFundName("");
      setFundCode("");
      setCategory("");
      setNav("");

      fetchFunds();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to add fund"
      );

    }

  };

  // ✅ LOAD FUNDS

  useEffect(() => {

    fetchFunds();

  }, []);

  return (

    <div className="p-8 text-white">

      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      {/* ADD FUND FORM */}

      <div className="bg-[#111827] p-6 rounded-xl max-w-md">

        <h2 className="text-xl font-semibold mb-4">
          Add Mutual Fund
        </h2>

        <input
          type="text"
          placeholder="Fund Name"
          value={fundName}
          onChange={(e) => setFundName(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-gray-900 border border-gray-700"
        />

        <input
          type="text"
          placeholder="Fund Code"
          value={fundCode}
          onChange={(e) => setFundCode(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-gray-900 border border-gray-700"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-gray-900 border border-gray-700"
        />

        <input
          type="number"
          placeholder="NAV"
          value={nav}
          onChange={(e) => setNav(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-900 border border-gray-700"
        />

        <button
          onClick={handleAddFund}
          className="w-full bg-green-400 hover:bg-green-500 text-black font-bold py-3 rounded"
        >
          Add Fund
        </button>

      </div>

      {/* FUND LIST */}

      <div className="mt-10">

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

                  <div className="mt-2 flex items-center gap-2">

                    <input
                      type="number"
                      value={editNav}
                      onChange={(e) =>
                        setEditNav(e.target.value)
                      }
                      className="bg-gray-900 border border-gray-700 p-2 rounded text-white"
                    />

                    <button
                      onClick={() =>
                        handleUpdateFund(fund._id)
                      }
                      className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded text-white"
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
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit NAV
                </button>

                <button
                  onClick={() =>
                    handleDeleteFund(fund._id)
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default AdminDashboard;
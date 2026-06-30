import { useState } from "react";
import api from "../../api/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

function FundManager({ funds, fetchFunds, fetchStats }) {
  const { token } = useAuth();

  const [fundName, setFundName] = useState("");
  const [fundCode, setFundCode] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const [amfiCode, setAmfiCode] = useState("");
  const [category, setCategory] = useState("");
  const [nav, setNav] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [editNav, setEditNav] = useState("");

  // ADD FUND

  const handleAddFund = async () => {
    try {
      await api.post(
        "/funds",
        {
          fundName,
          fundCode,
          amfiCode,
          category,
          nav,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Fund added successfully");

      setFundName("");
      setFundCode("");
      setAmfiCode("");
      setCategory("");
      setNav("");

      fetchFunds();
      fetchStats();
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Failed to add fund");
    }
  };

  // DELETE FUND

  const handleDeleteFund = async (id) => {
    try {
      await api.delete(`/funds/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Fund deleted successfully");

      fetchFunds();
      fetchStats();
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // UPDATE NAV

  const handleUpdateFund = async (id) => {
    try {
      await api.put(
        `/funds/${id}`,
        {
          nav: editNav,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("NAV updated successfully");

      setEditingId(null);
      setEditNav("");

      fetchFunds();
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Update failed");
    }
  };
  // SYNC NAV

  const handleSyncNav = async (id) => {
    try {
      const res = await api.post(
        `/funds/sync/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`NAV Synced: ₹${res.data.nav}`);
      fetchFunds();
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "NAV Sync Failed");
    }
  };

  //sync All
  const handleSyncAll = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/funds/sync-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      fetchFunds();
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Failed to sync all NAVs");
    }
  };

  //searchfunds
  const handleSearchFunds = async (value) => {
    try {
      setSearchQuery(value);

      if (value.length < 2) {
        setSearchResults([]);
        return;
      }

      const token = localStorage.getItem("token");

      const res = await api.get(`/funds/search?q=${value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  //import
  const handleImportFund = async (schemeCode) => {
    try {
  
      const token =
        localStorage.getItem(
          "token"
        );
  
      const res =
        await api.post(
          "/funds/import",
          {
            schemeCode
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );
  
      toast.success(
        "Fund imported successfully"
      );
  
      fetchFunds();
  
    } catch (err) {
  
      console.error(err);
  
      toast.error(
        err.response?.data?.message ||
        "Import failed"
      );
  
    }
  };


  return (
    <>
<div className="bg-[#111827] p-6 rounded-xl max-w-2xl mb-6">

<h2 className="text-xl font-semibold mb-4">
  Search Mutual Funds
</h2>

<input
  type="text"
  placeholder="Search HDFC, SBI, ICICI..."
  value={searchQuery}
  onChange={(e) =>
    handleSearchFunds(
      e.target.value
    )
  }
  className="
    w-full
    p-3
    rounded
    bg-gray-900
    border
    border-gray-700
  "
/>

</div>

{
  searchResults.length > 0 && (
    <div className="mt-4 space-y-2">

      {searchResults.map((fund) => (

        <div
          key={fund.schemeCode}
          className="
            bg-gray-900
            border
            border-gray-700
            rounded-lg
            p-4
            flex
            justify-between
            items-center
          "
        >

          <div>
            <p className="font-semibold">
              {fund.schemeName}
            </p>

            <p className="text-sm text-gray-400">
              AMFI Code: {fund.schemeCode}
            </p>
          </div>

         <button
  onClick={() =>
    handleImportFund(
      fund.schemeCode
    )
  }
  className="
    bg-green-500
    hover:bg-green-600
    px-4
    py-2
    rounded-lg
    font-semibold
  "
>
  Import
</button>

        </div>

      ))}

    </div>
  )
}

      <div className="bg-[#111827] p-6 rounded-xl max-w-md mb-10">
        <h2 className="text-xl font-semibold mb-4">Add Mutual Fund</h2>

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
          placeholder="AMFI Code"
          value={amfiCode}
          onChange={(e) => setAmfiCode(e.target.value)}
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

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Manage Funds</h2>

          <button
            onClick={handleSyncAll}
            className="
    bg-green-500
    hover:bg-green-600
    px-5
    py-2
    rounded-lg
    text-white
    font-semibold
    transition
  "
          >
            Sync All NAVs
          </button>
        </div>

        <div className="space-y-4">
          {funds.map((fund) => (
            <div
              key={fund._id}
              className="bg-[#111827] p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{fund.fundName}</h3>

                <p className="text-gray-400">{fund.category}</p>

                {editingId === fund._id ? (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="number"
                      value={editNav}
                      onChange={(e) => setEditNav(e.target.value)}
                      className="bg-gray-900 border border-gray-700 p-2 rounded"
                    />

                    <button
                      onClick={() => handleUpdateFund(fund._id)}
                      className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p className="text-green-400">NAV: ₹{fund.nav}</p>
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
                  onClick={() => handleSyncNav(fund._id)}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                >
                  Sync NAV
                </button>

                <button
                  onClick={() => handleDeleteFund(fund._id)}
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
  );
}

export default FundManager;

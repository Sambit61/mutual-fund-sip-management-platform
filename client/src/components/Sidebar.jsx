function Sidebar({ setPage }) {

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="w-60 bg-gray-900 text-white min-h-screen p-6">

      <h1 className="text-xl font-bold mb-10">
        FinVest
      </h1>

      <div className="flex flex-col gap-4">

        <button onClick={() => setPage("dashboard")} className="text-left hover:text-gray-300">
          Dashboard
        </button>

        <button onClick={() => setPage("funds")} className="text-left hover:text-gray-300">
          Markets
        </button>

        <button onClick={() => setPage("portfolio")} className="text-left hover:text-gray-300">
          Portfolio
        </button>

        <button onClick={() => setPage("transactions")} className="text-left hover:text-gray-300">
          Transactions
        </button>

        <button
          onClick={logout}
          className="bg-red-500 mt-6 px-3 py-2 rounded"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Sidebar;
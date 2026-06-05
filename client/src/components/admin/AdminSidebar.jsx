function AdminSidebar({
  activeSection,
  setActiveSection,
}) {
  return (
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
  );
}

export default AdminSidebar;
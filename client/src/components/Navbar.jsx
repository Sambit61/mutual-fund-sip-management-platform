function Navbar({ setPage, token, setToken }) {

  const role = localStorage.getItem("role");

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    setToken(null);

    setPage("login");

  };

  const navLinks = [
    { id: "dashboard", label: "Home" },
    { id: "funds", label: "Funds" },
    { id: "portfolio", label: "Portfolio" },
    { id: "transactions", label: "Transactions" },
  ];

  return (

    <div className="flex justify-between items-center px-10 py-5 bg-transparent text-sm font-medium z-10 relative">

      {/* LEFT: Logo */}

      <div className="flex items-center">

        <span
          className="text-brand text-lg font-bold tracking-widest cursor-pointer"
          onClick={() => setPage(token ? "dashboard" : "landing")}
        >
          MUTUALSIP
        </span>

      </div>

      {/* CENTER: NAV LINKS */}

      {token && (

        <div className="flex gap-8 items-center text-gray-400">

          {navLinks.map((link) => (

            <button
              key={link.id}
              onClick={() => setPage(link.id)}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </button>

          ))}

          {/* ✅ ADMIN BUTTON */}

          {role === "admin" && (

            <button
              onClick={() => setPage("admin")}
              className="text-red-400 hover:text-red-300 font-bold"
            >
              Admin
            </button>

          )}

        </div>

      )}

      {/* RIGHT SECTION */}

      <div>

        {!token ? (

          <div className="flex gap-4 items-center">

            <button
              onClick={() => setPage("register")}
              className="text-white hover:text-brand transition-colors font-semibold"
            >
              Register
            </button>

            <button
              onClick={() => setPage("login")}
              className="bg-brand text-gray-900 px-5 py-2 rounded font-semibold hover:bg-brand-dark hover:text-white transition-colors"
            >
              Login
            </button>

          </div>

        ) : (

          <div className="flex gap-6 items-center text-gray-400">

            <button
              className="hover:text-white transition-colors"
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="hover:text-white transition-colors"
            >
              Logout
            </button>

          </div>

        )}

      </div>

    </div>

  );

}

export default Navbar;
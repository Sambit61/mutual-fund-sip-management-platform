import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const role =
    localStorage.getItem("role");

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    navigate("/login");

  };

  const navLinks = [

    {
      path: "/dashboard",
      label: "Home"
    },

    {
      path: "/funds",
      label: "Funds"
    },

    {
      path: "/portfolio",
      label: "Portfolio"
    },

    {
      path: "/transactions",
      label: "Transactions"
    }

  ];

  return (

    <div className="flex justify-between items-center px-10 py-5 bg-transparent text-sm font-medium z-10 relative">

      {/* LOGO */}

      <div className="flex items-center">

        <span
          className="text-brand text-lg font-bold tracking-widest cursor-pointer"
          onClick={() =>
            navigate(
              token
                ? "/dashboard"
                : "/"
            )
          }
        >
          MUTUALSIP
        </span>

      </div>

      {/* NAVIGATION */}

      {token && (

        <div className="flex gap-8 items-center text-gray-400">

          {navLinks.map((link) => (

            <button
              key={link.path}
              onClick={() =>
                navigate(link.path)
              }
              className="transition-colors hover:text-white"
            >
              {link.label}
            </button>

          ))}

          {role === "admin" && (

            <button
              onClick={() =>
                navigate("/admin")
              }
              className="text-red-400 hover:text-red-300 font-bold"
            >
              Admin
            </button>

          )}

        </div>

      )}

      {/* RIGHT SIDE */}

      <div>

        {!token ? (

          <div className="flex gap-4 items-center">

            <button
              onClick={() =>
                navigate("/register")
              }
              className="text-white hover:text-brand transition-colors font-semibold"
            >
              Register
            </button>

            <button
              onClick={() =>
                navigate("/login")
              }
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
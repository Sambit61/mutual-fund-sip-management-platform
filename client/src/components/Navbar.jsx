import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {

  const navigate = useNavigate();

  const {
    token,
    user,
    logout
  } = useAuth();

  const handleLogout = () => {

    logout();

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
      path: "/stocks",
      label: "Stocks"
    },

    {
      path: "/watchlist",
      label: "Watchlist"
    },
  
    {
      path: "/portfolio",
      label: "Portfolio"
    },
  
    {
      path: "/transactions",
      label: "Transactions"
    },
  
    {
      path: "/sip-calculator",
      label: "SIP Calculator"
    }
  
  ];

  return (

    <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-4 gap-4 bg-transparent text-sm font-medium z-10 relative">

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

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 items-center text-gray-400">

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

          {user?.role === "admin" && (

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

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 items-center text-gray-400">
<button
  onClick={() =>
    navigate("/profile")
  }
  className="hover:text-white transition-colors"
>
  {user?.name || "Profile"}
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
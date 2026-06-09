import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {

  const {
    token,
    user,
    loading
  } = useAuth();

  if (loading) {

    return (
      <div>
        Loading...
      </div>
    );

  }

  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  if (user?.role !== "admin") {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }

  return children;

}

export default AdminRoute;
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext =
  createContext();

export function AuthProvider({
  children
}) {

  const [token, setToken] =
    useState(null);

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const storedToken =
      localStorage.getItem("token");

    const storedRole =
      localStorage.getItem("role");

    if (storedToken) {

      setToken(storedToken);

      setUser({
        role: storedRole
      });

    }

    setLoading(false);

  }, []);

  const login = (
    newToken,
    role
  ) => {

    localStorage.setItem(
      "token",
      newToken
    );

    localStorage.setItem(
      "role",
      role
    );

    setToken(newToken);

    setUser({
      role
    });

  };

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );

    setToken(null);

    setUser(null);

  };

  return (

    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {

  return useContext(
    AuthContext
  );

}
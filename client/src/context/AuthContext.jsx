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

    const storedUser =
      localStorage.getItem("user");

    if (
      storedToken &&
      storedUser
    ) {

      setToken(
        storedToken
      );

      setUser(
        JSON.parse(
          storedUser
        )
      );

    }

    setLoading(false);

  }, []);

  const login = (
    newToken,
    userData
  ) => {

    localStorage.setItem(
      "token",
      newToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(
        userData
      )
    );

    setToken(
      newToken
    );

    setUser(
      userData
    );

  };

  const updateUser = (
    updatedUser
  ) => {

    localStorage.setItem(
      "user",
      JSON.stringify(
        updatedUser
      )
    );

    setUser(
      updatedUser
    );

  };

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
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
        logout,
        updateUser
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
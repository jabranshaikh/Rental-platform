import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  registerUser,
  loginUser,
  getProfile,
} from "../api/authApi";

const AuthContext = createContext();

function AuthProvider({ children }) {
  // =========================
  // USER
  // =========================
  const [user, setUser] = useState(null);

  // =========================
  // TOKEN
  // =========================
  const [token, setToken] = useState(() => {
    return localStorage.getItem("staynest_token");
  });

  // =========================
  // LOADING
  // =========================
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD SAVED USER
  // =========================
  useEffect(() => {
    const loadUser = async () => {
      const savedToken =
        localStorage.getItem("staynest_token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response =
          await getProfile(savedToken);

        if (response.success) {
          setUser(response.user);
          setToken(savedToken);

          localStorage.setItem(
            "staynest_user",
            JSON.stringify(response.user)
          );
        } else {
          throw new Error(
            "Session is no longer valid."
          );
        }
      } catch (error) {
        console.error(
          "Session Error:",
          error
        );

        localStorage.removeItem(
          "staynest_token"
        );

        localStorage.removeItem(
          "staynest_user"
        );

        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // =========================
  // REGISTER
  // =========================
  const register = async (userData) => {
    try {
      const response =
        await registerUser(userData);

      if (!response.success) {
        throw new Error(
          response.message ||
            "Registration failed."
        );
      }

      // Save token
      localStorage.setItem(
        "staynest_token",
        response.token
      );

      // Save user
      localStorage.setItem(
        "staynest_user",
        JSON.stringify(response.user)
      );

      // Update React state
      setToken(response.token);
      setUser(response.user);

      return response;
    } catch (error) {
      console.error(
        "Register Error:",
        error
      );

      throw error;
    }
  };

  // =========================
  // LOGIN
  // =========================
  const login = async (loginData) => {
    try {
      const response =
        await loginUser(loginData);

      if (!response.success) {
        throw new Error(
          response.message ||
            "Login failed."
        );
      }

      // Save token
      localStorage.setItem(
        "staynest_token",
        response.token
      );

      // Save user
      localStorage.setItem(
        "staynest_user",
        JSON.stringify(response.user)
      );

      // Update React state
      setToken(response.token);
      setUser(response.user);

      return response;
    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      throw error;
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem(
      "staynest_token"
    );

    localStorage.removeItem(
      "staynest_user"
    );

    setUser(null);
    setToken(null);
  };

  // =========================
  // AUTHENTICATION STATUS
  // =========================
  const isAuthenticated =
    Boolean(user && token);

  // =========================
  // CONTEXT PROVIDER
  // =========================
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================
// useAuth HOOK
// =========================
export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

// =========================
// EXPORT
// =========================
export { AuthProvider };

export default AuthProvider;
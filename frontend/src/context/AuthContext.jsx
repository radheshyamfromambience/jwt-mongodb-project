import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing login
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/users/profile");

        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);

    setUser(response.data.user);

    return response.data;
  };

  // Register
  const register = async (name, email, password, role) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });

    localStorage.setItem("token", response.data.token);

    setUser(response.data.user);

    return response.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
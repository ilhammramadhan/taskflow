import { createContext, useEffect, useState } from "react";
import axios from "../utils/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const storedUser = localStorage.getItem("taskflow_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }

    setLoading(false);
  }, []);

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      console.log("Logout API error");
    }

    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
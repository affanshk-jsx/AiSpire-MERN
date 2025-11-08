// frontend/src/context/AuthContext.js
import React, { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Rehydrate user on app start
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.token && !storedToken) {
          localStorage.setItem("token", parsedUser.token);
        }
      }

      if (storedToken) setToken(storedToken);
    } catch (err) {
      console.error("❌ Failed to rehydrate user:", err);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Login function (simplified + robust)
  const login = (userData) => {
    if (!userData) return;

    // Handle both backend response types
    const u = {
      _id: userData._id || userData?.user?._id,
      name: userData.name || userData?.user?.name,
      email: userData.email || userData?.user?.email,
      role: userData.role || userData?.user?.role || "user",
      isAdmin:
        userData.isAdmin ||
        userData?.user?.isAdmin ||
        userData.role === "admin" ||
        false,
      token:
        userData.token ||
        userData?.user?.token ||
        localStorage.getItem("token") ||
        null,
    };

    // Persist
    localStorage.setItem("user", JSON.stringify(u));
    if (u.token) localStorage.setItem("token", u.token);

    setUser(u);
    setToken(u.token);
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // ✅ Memoized context value
  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user && (user.token || token)),
      token: token || user?.token || null,
      user,
      login,
      logout,
      loading,
    }),
    [token, user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

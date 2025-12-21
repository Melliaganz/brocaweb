import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
   if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAuthenticated(true);
        setUser({ id: payload.id, role: payload.role });
      } catch (err) {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

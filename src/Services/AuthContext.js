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

        const currentTime = Date.now() / 1000;
        if (payload.exp && payload.exp < currentTime) {
          logout();
        } else {
          setIsAuthenticated(true);
          setUser({ id: payload.id, role: payload.role, nom: payload.nom });
        }
      } catch (err) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart"); // Vide le panier du stockage local
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ 
        isAuthenticated, 
        setIsAuthenticated, 
        user, 
        setUser, 
        loading, 
        logout 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

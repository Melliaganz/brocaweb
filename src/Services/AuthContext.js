import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  const SOCKET_URL = process.env.REACT_APP_API_URL.replace("/api", "");

  const initSocket = (userId) => {
    if (socket && socket.connected) return;

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    newSocket.on("connect", () => {
      newSocket.emit("register_user", userId);
    });

    setSocket(newSocket);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp && payload.exp < currentTime) {
          logout();
        } else {
          setIsAuthenticated(true);
          const userData = {
            id: payload.id,
            role: payload.role,
            nom: payload.nom,
          };
          setUser(userData);
          initSocket(userData.id);
        }
      } catch (err) {
        logout();
      }
    }
    setLoading(false);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const logout = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    sessionStorage.removeItem("token");

    // On ne supprime plus "cart" ici si on veut garder une trace locale
    // ou simplement laisser le CartContext s'en charger au prochain login.

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
        logout,
        socket,
        initSocket,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

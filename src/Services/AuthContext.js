import { createContext, useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  const SOCKET_URL = process.env.REACT_APP_API_URL.replace("/api", "");

  const logout = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  }, [socket]);

  const initSocket = useCallback((userId) => {
    if (socket?.connected) {
      socket.emit("register_user", userId);
      return;
    }

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      newSocket.emit("register_user", userId);
    });

    setSocket(newSocket);
  }, [SOCKET_URL, socket]);

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
        }
      } catch (err) {
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

useEffect(() => {
  if (isAuthenticated && user?.id && !socket) {
    initSocket(user.id);
  }
  
  return () => {
    if (socket) {
      socket.off("connect");
    }
  };
}, [isAuthenticated, user?.id, initSocket]);

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

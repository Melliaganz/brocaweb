import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  const socketRef = useRef(null);

  const SOCKET_URL = process.env.REACT_APP_API_URL.replace("/api", "");

  const logout = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
    }
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const initSocket = useCallback(
    (userId) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("register_user", userId);
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

      socketRef.current = newSocket;
      setSocket(newSocket);
    },
    [SOCKET_URL]
  );

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
    if (isAuthenticated && user?.id && !socketRef.current) {
      initSocket(user.id);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
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

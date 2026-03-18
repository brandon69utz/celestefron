import { createContext, useContext, useEffect, useMemo, useState } from "react";
import socket from "../socket";
import { useAuth } from "../auth/AuthContext.jsx";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { me } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    if (!me) return;

    socket.emit("unirse_notificaciones", {
      userId: me.id,
      admin: !!me.admin,
    });

    socket.on("nueva_notificacion", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setHasNew(true);
    });

    return () => {
      socket.off("nueva_notificacion");
    };
  }, [me]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setHasNew(false);
  };

  const value = useMemo(
    () => ({
      notifications,
      hasNew,
      markAllAsRead,
    }),
    [notifications, hasNew]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
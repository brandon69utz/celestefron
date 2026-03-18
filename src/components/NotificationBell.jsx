import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext.jsx";

function getRouteByType(type, entityId) {
  switch (type) {
    case "mensaje":
      return "/app/mensajes";
    case "multa":
      return "/app/pagos";
    case "asamblea":
      return "/app/eventos";
    case "pago_atrasado":
      return "/app/pagos";
    case "encuesta":
      return "/app/encuesta-admin";
    default:
      return "/app";
  }
}

export default function NotificationBell() {
  const { notifications, hasNew, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);

    if (next) {
      markAllAsRead();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        title="Notificaciones"
        className={`relative flex items-center justify-center rounded px-2 py-1 text-sm transition ${
          hasNew
            ? "bg-yellow-300 text-slate-900 ring-2 ring-white animate-pulse"
            : "text-white hover:bg-white/10"
        }`}
      >
        <span className="text-base">🔔</span>

        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 min-w-[20px] rounded-full bg-red-600 px-1.5 py-0.5 text-center text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-md border border-slate-200 bg-white text-slate-800 shadow-lg">
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="font-semibold">Notificaciones</div>
            <div className="text-xs text-slate-500">
              {notifications.length} registradas
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  to={getRouteByType(n.type, n.entityId)}
                  onClick={() => setOpen(false)}
                  className={`block border-b border-slate-100 px-4 py-3 hover:bg-slate-50 ${
                    !n.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold capitalize">
                      {String(n.type).replace("_", " ")}
                    </span>

                    {!n.read && (
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] text-blue-700">
                        Nueva
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-700">{n.title}</p>

                  {n.body && (
                    <p className="mt-1 text-xs text-slate-500">{n.body}</p>
                  )}
                </Link>
              ))
            ) : (
              <div className="px-4 py-6 text-sm text-slate-500">
                No hay notificaciones.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

export default function Topbar() {
  const nav = useNavigate();
  const { me, logout } = useAuth();

  const name =
    me?.persona
      ? `${me.persona.nombre ?? ""} ${me.persona.apellido_p ?? ""}`.trim()
      : "Usuario";

  async function onLogout() {
    try {
      await logout?.();
    } finally {
      nav("/login", { replace: true });
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-700/40 bg-blue-600 text-white">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-white/15 font-bold">
            C
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">CondominioSOFT</div>
            <div className="text-xs text-white/80">Administración</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />

          <button className="rounded px-2 py-1 text-xs hover:bg-white/10">
            ⚙️
          </button>

          <div className="ml-2 flex items-center gap-2 rounded bg-white/10 px-2 py-1">
            <div className="h-7 w-7 rounded bg-white/20" />
            <div className="hidden sm:block">
              <div className="text-xs font-semibold">{name}</div>
              <div className="text-[11px] text-white/80">
                {me?.admin ? "Administrador" : "Residente"}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="ml-2 rounded bg-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/20"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
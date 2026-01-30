import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const itemBase =
  "flex items-center gap-2 rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-100";
const itemActive = "bg-slate-100 font-semibold text-slate-900";

function Item({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${itemBase} ${isActive ? itemActive : ""}`}
    >
      <span className="w-6 text-center">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const { me } = useAuth();
  const admin = !!me?.admin;

  const name =
    me?.persona
      ? `${me.persona.nombre ?? ""} ${me.persona.apellido_p ?? ""}`.trim()
      : "Usuario";

  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 p-3">
        <div className="h-10 w-10 rounded bg-slate-200" />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{name}</div>
          <div className="text-xs text-slate-500">
            {admin ? "Administrador" : "Residente"}
          </div>
        </div>
      </div>

      <div className="p-3">
        <input
          placeholder="Buscar..."
          className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </div>

      <div className="px-2 pb-2">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Menú
        </div>

        <Item to="/app" icon="🏠" label="Dashboard" />
        <Item to="/app/mensajes" icon="💬" label="Mensajes" />

        {admin && (
          <>
            <div className="mt-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Administración
            </div>

            <Item to="/app/residentes" icon="👤" label="Residentes" />
            <Item to="/app/departamentos" icon="🏢" label="Departamentos" />
            <Item to="/app/pagos" icon="💳" label="Pagos" />
            <Item to="/app/eventos" icon="🗳️" label="Eventos" />
          </>
        )}
      </div>
    </div>
  );
}

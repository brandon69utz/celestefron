import { useAuth } from "../auth/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function AppDashboard() {
  const { me } = useAuth();
  const admin = !!me?.admin;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              {admin
                ? "Vista de administrador: accesos rápidos a la gestión del condominio."
                : "Vista de residente: acceso a mensajes, avisos y estado general."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <RoleChip admin={admin} />
            <div className="hidden sm:block h-10 w-px bg-slate-800" />
            <div className="text-sm text-slate-300">
              <div className="font-semibold leading-5">
                {me?.persona?.nombre ?? "Usuario"} {me?.persona?.apellido_p ?? ""}
              </div>
              <div className="text-xs text-slate-500 leading-5">
                {me?.persona?.email ?? "—"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      {admin ? <AdminGrid /> : <ResidentGrid />}
    </div>
  );
}

function RoleChip({ admin }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold
      ${
        admin
          ? "border-emerald-800/60 bg-emerald-900/20 text-emerald-200"
          : "border-sky-800/60 bg-sky-900/20 text-sky-200"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          admin ? "bg-emerald-400" : "bg-sky-400"
        }`}
      />
      {admin ? "Administrador" : "Residente"}
    </span>
  );
}

function AdminGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card
        icon={<UsersIcon />}
        title="Residentes"
        desc="Alta, edición y control"
        to="/app/residentes"
      />
      <Card
        icon={<BuildingIcon />}
        title="Departamentos"
        desc="Asignación y estado"
        to="/app/departamentos"
      />
      <Card
        icon={<MoneyIcon />}
        title="Pagos"
        desc="Mensualidades y atrasos"
        to="/app/pagos"
      />
      <Card
        icon={<CalendarIcon />}
        title="Eventos"
        desc="Asambleas y encuestas"
        to="/app/eventos"
      />
      <Card
        icon={<ChatIcon />}
        title="Mensajes"
        desc="Comunicación interna"
        to="/app/mensajes"
      />
      <Card
        icon={<ReportIcon />}
        title="Reportes"
        desc="Pendiente (backend)"
        disabled
      />
    </div>
  );
}

function ResidentGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card
        icon={<ChatIcon />}
        title="Mensajes"
        desc="Bandeja e historial"
        to="/app/mensajes"
      />
      <Card
        icon={<MoneyIcon />}
        title="Mis pagos"
        desc="Pendiente (backend)"
        disabled
      />
      <Card
        icon={<BellIcon />}
        title="Avisos"
        desc="Pendiente (backend)"
        disabled
      />
    </div>
  );
}

function Card({ icon, title, desc, to, disabled }) {
  const base =
    "group rounded-2xl border border-slate-800 bg-slate-900/20 p-4 transition";
  const hover = disabled
    ? "opacity-60"
    : "hover:bg-slate-900/40 hover:border-slate-700";
  const content = (
    <div className={`${base} ${hover}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
            {icon}
          </div>

          <div>
            <h2 className="font-semibold text-slate-100">{title}</h2>
            <p className="mt-1 text-sm text-slate-400">{desc}</p>
          </div>
        </div>

        {!disabled && (
          <span className="text-slate-500 transition group-hover:text-slate-200">
            →
          </span>
        )}
      </div>

      {!disabled && (
        <div className="mt-4 text-sm font-semibold text-white/90">
          Abrir
          <span className="ml-2 inline-block transition group-hover:translate-x-0.5">
            →
          </span>
        </div>
      )}
    </div>
  );

  if (disabled) return content;
  return <Link to={to}>{content}</Link>;
}

/* ====== Icons (inline, no librerías) ====== */
function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-200" fill="none">
      <path
        d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 20c1.4-3 4.3-5 8-5s6.6 2 8 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-200" fill="none">
      <path
        d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 7h2M9 11h2M9 15h2M13 7h2M13 11h2M13 15h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-200" fill="none">
      <path
        d="M3 7h18v10H3V7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 10.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-200" fill="none">
      <path
        d="M7 3v3M17 3v3M4 8h16M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-200" fill="none">
      <path
        d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4v-4H6a2 2 0 0 1-2-2V6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-200" fill="none">
      <path
        d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 11h6M9 15h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-200" fill="none">
      <path
        d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M18 16H6c1.2-1.2 2-2.6 2-5a4 4 0 0 1 8 0c0 2.4.8 3.8 2 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function AppDashboard() {
  const { me } = useAuth();
  const admin = !!me?.admin;

  const fullName = me?.persona
    ? `${me.persona.nombre ?? ""} ${me.persona.apellido_p ?? ""} ${
        me.persona.apellido_m ?? ""
      }`.trim()
    : "Usuario";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-slate-500">
              {admin ? "Panel de Administrador" : "Panel de Residente"}
            </div>
            <h1 className="mt-1 text-xl font-semibold">Dashboard</h1>
          </div>

          <div className="text-sm text-slate-600">
            Bienvenido, <span className="font-semibold">{fullName}</span>
          </div>
        </div>

        <div className="px-4 py-3">
          <p className="text-sm text-slate-600">
            {admin
              ? "Administra residentes, departamentos, pagos y eventos desde este panel."
              : "Consulta tus mensajes, avisos y movimientos desde este panel."}
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Estado" value="Disponible" hint="Sistema en línea" />
        <StatCard title="Acceso" value={admin ? "Admin" : "Residente"} hint="Rol actual" />
        <StatCard title="Gestión" value={admin ? "Completa" : "Limitada"} hint="Permisos" />
        <StatCard title="Notificaciones" value="Mock" hint="Pendiente backend" />
      </div>

      {/* Main grid */}
      {admin ? <AdminGrid /> : <ResidentGrid />}
    </div>
  );
}

function StatCard({ title, value, hint }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{hint}</div>
    </div>
  );
}

function AdminGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Section title="Administración" subtitle="Gestión del condominio">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <ActionCard
            title="Residentes"
            desc="Alta, edición y control"
            to="/app/residentes"
            icon="👤"
          />
          <ActionCard
            title="Departamentos"
            desc="Asignación y estado"
            to="/app/departamentos"
            icon="🏢"
          />
          <ActionCard
            title="Pagos"
            desc="Mensualidades y atrasos"
            to="/app/pagos"
            icon="💳"
          />
          <ActionCard
            title="Eventos"
            desc="Asambleas y encuestas"
            to="/app/eventos"
            icon="🗳️"
          />
          <ActionCard
            title="Mensajes"
            desc="Comunicación interna"
            to="/app/mensajes"
            icon="💬"
          />
          <ActionCard
            title="Reportes"
            desc="Pendiente (backend)"
            disabled
            icon="📄"
          />
        </div>
      </Section>

      <Section title="Actividad" subtitle="Resumen rápido">
        <div className="space-y-3">
          <MiniInfo
            title="Pendientes"
            text="Pagos atrasados, reportes y avisos aún están en modo mock."
          />
          <MiniInfo
            title="Siguiente paso"
            text="Vamos a mejorar tablas y pantallas para que se vean como sistema real."
          />
          <MiniInfo
            title="Tip"
            text="Si algo se ve raro, normalmente es por imports o cache; reinicia Vite."
          />
        </div>
      </Section>

      <Section title="Acciones rápidas" subtitle="Atajos">
        <div className="grid gap-3">
          <QuickLink to="/app/residentes" label="Crear residente" />
          <QuickLink to="/app/departamentos" label="Administrar departamentos" />
          <QuickLink to="/app/pagos" label="Revisar pagos" />
          <QuickLink to="/app/mensajes" label="Ir a mensajes" />
        </div>
      </Section>
    </div>
  );
}

function ResidentGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Section title="Mis accesos" subtitle="Lo principal para ti">
        <div className="grid gap-3">
          <ActionCard
            title="Mensajes"
            desc="Bandeja e historial"
            to="/app/mensajes"
            icon="💬"
          />
          <ActionCard title="Mis pagos" desc="Pendiente (backend)" disabled icon="💳" />
          <ActionCard title="Avisos" desc="Pendiente (backend)" disabled icon="🔔" />
        </div>
      </Section>

      <Section title="Estado" subtitle="Información">
        <div className="space-y-3">
          <MiniInfo
            title="Cuenta"
            text="Tu sesión está activa. Puedes revisar mensajes y avisos."
          />
          <MiniInfo
            title="Siguiente"
            text="Luego vamos a crear la pantalla de avisos y pagos cuando retomemos backend."
          />
        </div>
      </Section>

      <Section title="Acciones rápidas" subtitle="Atajos">
        <div className="grid gap-3">
          <QuickLink to="/app/mensajes" label="Ir a mensajes" />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="text-xs text-slate-500">{subtitle}</div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ActionCard({ title, desc, to, disabled, icon }) {
  const card =
    "rounded-md border border-slate-200 bg-white p-3 shadow-sm transition hover:bg-slate-50";
  const disabledCls = "opacity-60 pointer-events-none";

  return (
    <Link to={disabled ? "#" : to} className={disabled ? disabledCls : ""}>
      <div className={card}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-lg">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-900">{title}</h3>
              {!disabled && (
                <span className="text-xs font-semibold text-blue-600">Abrir →</span>
              )}
              {disabled && (
                <span className="text-[11px] rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                  Pendiente
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-600">{desc}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MiniInfo({ title, text }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        {title}
      </div>
      <div className="mt-1 text-sm text-slate-700">{text}</div>
    </div>
  );
}

function QuickLink({ to, label }) {
  return (
    <Link
      to={to}
      className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
    >
      {label} →
    </Link>
  );
}

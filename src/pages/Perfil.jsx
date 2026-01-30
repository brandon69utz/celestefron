import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";

export default function Perfil() {
  const { me, logout } = useAuth();

  const persona = me?.persona || {};
  const isAdmin = !!me?.admin;

  return (
    <div className="space-y-4">
      <Card
        title="Mi perfil"
        subtitle="Información de tu cuenta"
        right={<Badge tone={isAdmin ? "emerald" : "sky"}>{isAdmin ? "Administrador" : "Residente"}</Badge>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" value={persona.nombre || "—"} />
          <Field label="Apellido paterno" value={persona.apellido_p || "—"} />
          <Field label="Apellido materno" value={persona.apellido_m || "—"} />
          <Field label="Email" value={persona.email || "—"} />
          <Field label="Celular" value={persona.celular || "—"} />
          <Field label="ID usuario" value={me?.id ?? "—"} />
        </div>

        <div className="mt-6 flex justify-end">
          <Button tone="danger" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-100">{value}</div>
    </div>
  );
}

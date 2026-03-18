import { useEffect, useMemo, useState } from "react";

import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Badge from "../components/ui/Badge.jsx";
import Modal from "../components/ui/Modal.jsx";
import Table from "../components/ui/Table.jsx";
import ActionAlert from "../components/ui/ActionAlert.jsx";
import LoadingButton from "../components/ui/LoadingButton.jsx";
import useAsyncAction from "../hooks/useAsyncAction.js";

import {
  getResidentes,
  createResidente,
  updateResidente,
  deleteResidente,
} from "../api/residentes.js";

export default function Residentes() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    apellido_p: "",
    apellido_m: "",
    email: "",
    celular: "",
    departamento_id: "",
    password: "",
  });

  const {
    loading: actionLoading,
    alert,
    runAction,
    closeAlert,
  } = useAsyncAction();

  async function load() {
    setLoading(true);
    try {
      const data = await getResidentes();
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setRows(list);
    } catch (e) {
      console.error(e);
      alert("No se pudieron cargar residentes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;

    return rows.filter((r) => {
      const p = r.persona ?? r;
      const dep = r.departamento ?? null;
      const full =
        `${p.nombre ?? ""} ${p.apellido_p ?? ""} ${p.apellido_m ?? ""} ${p.email ?? ""} ${p.celular ?? ""} ${dep?.numero ?? ""}`.toLowerCase();

      return full.includes(s);
    });
  }, [rows, q]);

  function openCreate() {
    setEditing(null);
    setForm({
      nombre: "",
      apellido_p: "",
      apellido_m: "",
      email: "",
      celular: "",
      departamento_id: "",
      password: "",
    });
    setOpen(true);
  }

  function openEdit(row) {
    const p = row.persona ?? row;

    setEditing(row);
    setForm({
      nombre: p.nombre ?? "",
      apellido_p: p.apellido_p ?? "",
      apellido_m: p.apellido_m ?? "",
      email: p.email ?? "",
      celular: p.celular ?? "",
      departamento_id: row.departamento_id ?? row?.departamento?.id ?? "",
      password: "",
    });

    setOpen(true);
  }

  async function onSave(e) {
    e.preventDefault();

    try {
      const basePayload = {
        nombre: form.nombre,
        apellido_p: form.apellido_p,
        apellido_m: form.apellido_m || null,
        email: form.email,
        celular: form.celular,
        departamento_id: form.departamento_id
          ? Number(form.departamento_id)
          : null,
      };

      await runAction({
        action: async () => {
          if (editing?.id) {
            return await updateResidente(editing.id, basePayload);
          }

          return await createResidente({
            ...basePayload,
            password: form.password,
          });
        },
        successTitle: editing ? "Residente actualizado" : "Residente creado",
        successMessage: editing
          ? "Los datos del residente se actualizaron correctamente."
          : "El residente se registró correctamente.",
        errorTitle: "No se pudo guardar",
        getErrorMessage: (err) => {
          const data = err?.response?.data;
          if (data?.errors?.email?.[0]) return data.errors.email[0];
          if (data?.errors?.departamento_id?.[0])
            return data.errors.departamento_id[0];
          if (data?.errors?.password?.[0]) return data.errors.password[0];
          return data?.message || "Revisa los datos enviados.";
        },
      });

      setOpen(false);
      await load();
    } catch (err) {
      console.error(err);
    }
  }

  async function onDelete(row) {
    const p = row.persona ?? row;
    const ok = confirm(
      `¿Eliminar residente: ${p.nombre ?? ""} ${p.apellido_p ?? ""}?`
    );
    if (!ok) return;

    try {
      await runAction({
        action: () => deleteResidente(row.id),
        successTitle: "Residente eliminado",
        successMessage: "El residente se eliminó correctamente.",
        errorTitle: "No se pudo eliminar",
        getErrorMessage: (err) =>
          err?.response?.data?.message || "Ocurrió un error al eliminar.",
      });

      await load();
    } catch (err) {
      console.error(err);
    }
  }

  const columns = [
    {
      key: "nombre",
      label: "Residente",
      render: (r) => {
        const p = r.persona ?? r;
        const name = `${p.nombre ?? ""} ${p.apellido_p ?? ""} ${p.apellido_m ?? ""}`.trim();

        return (
          <div className="min-w-[220px]">
            <div className="font-semibold text-slate-900">{name || "—"}</div>
            <div className="text-xs text-slate-500">{p.email || "—"}</div>
          </div>
        );
      },
    },
    {
      key: "celular",
      label: "Celular",
      render: (r) => r.persona?.celular ?? r.celular ?? "—",
    },
    {
      key: "departamento",
      label: "Departamento",
      render: (r) => {
        const dep = r.departamento ?? null;
        const label = dep ? `#${dep.numero ?? dep.id ?? "—"}` : "Sin asignar";
        return <Badge tone={dep ? "blue" : "gray"}>{label}</Badge>;
      },
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (r) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(r)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-slate-500">Administración</div>
            <h1 className="mt-1 text-xl font-semibold">Residentes</h1>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Input
              placeholder="Buscar por nombre, correo, celular o departamento..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button onClick={openCreate}>+ Nuevo residente</Button>
          </div>
        </div>

        <div className="px-4 py-3">
          <p className="text-sm text-slate-600">
            Gestiona altas, edición y eliminación de residentes.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Cargando residentes...
        </div>
      ) : (
        <Table
          columns={columns}
          rows={filtered.map((r) => ({ ...r, _key: r.id }))}
          emptyText="No hay residentes para mostrar."
        />
      )}

      <Modal
        open={open}
        title={editing ? "Editar residente" : "Nuevo residente"}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSave} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />

            <Input
              label="Apellido paterno"
              value={form.apellido_p}
              onChange={(e) =>
                setForm({ ...form, apellido_p: e.target.value })
              }
              required
            />

            <Input
              label="Apellido materno"
              value={form.apellido_m}
              onChange={(e) =>
                setForm({ ...form, apellido_m: e.target.value })
              }
            />

            <Input
              label="Celular"
              value={form.celular}
              onChange={(e) => setForm({ ...form, celular: e.target.value })}
              required
            />

            <Input
              label="Correo"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <Input
              label="Departamento ID"
              value={form.departamento_id}
              onChange={(e) =>
                setForm({ ...form, departamento_id: e.target.value })
              }
              placeholder="Ej: 1"
            />

            {!editing && (
              <Input
                label="Contraseña del residente"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                placeholder="Mínimo 6 caracteres"
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={actionLoading}
            >
              Cancelar
            </Button>

            <LoadingButton
              type="submit"
              loading={actionLoading}
              className="bg-slate-900 text-white hover:bg-slate-800"
            >
              Guardar
            </LoadingButton>
          </div>
        </form>
      </Modal>

      <ActionAlert
        open={alert.open}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />
    </div>
  );
}
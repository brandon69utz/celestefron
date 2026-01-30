import { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Badge from "../components/ui/Badge.jsx";
import Modal from "../components/ui/Modal.jsx";
import Table from "../components/ui/Table.jsx";

import {
  getDepartamentos,
  createDepartamento,
  updateDepartamento,
  deleteDepartamento,
} from "../api/departamentos.js";

export default function Departamentos() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  // UI
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [current, setCurrent] = useState(null);

  const [form, setForm] = useState({
    depa: "",
    codigo: "",
    moroso: false,
  });

  async function load() {
    setLoading(true);
    try {
      const deps = await getDepartamentos();
      setItems(Array.isArray(deps) ? deps : deps?.data ?? []);
    } catch (e) {
      console.error(e);
      setItems([]);
      alert("No se pudieron cargar departamentos (backend).");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // IMPORTANTE: si antes guardaste basura con torre/numero en localStorage
    // borra esto una vez:
    // localStorage.removeItem("departamentos");
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;

    return items.filter((d) => {
      const label = `${d?.depa ?? ""} ${d?.codigo ?? ""}`.toLowerCase();
      return label.includes(s);
    });
  }, [q, items]);

  function openCreate() {
    setMode("create");
    setCurrent(null);
    setForm({ depa: "", codigo: "", moroso: false });
    setOpen(true);
  }

  function openEdit(row) {
    setMode("edit");
    setCurrent(row);

    setForm({
      depa: row?.depa ?? "",
      codigo: row?.codigo ?? "",
      moroso: !!row?.moroso,
    });

    setOpen(true);
  }

  async function submit(e) {
    e.preventDefault();

    try {
      const payload = {
        depa: form.depa.trim(),
        codigo: form.codigo.trim(),
        moroso: !!form.moroso,
      };

      if (mode === "create") {
        await createDepartamento(payload);
      } else {
        await updateDepartamento(current?.id, payload);
      }

      setOpen(false);
      await load();
    } catch (err) {
      console.error(err);
      // Si es 422, aquí verías validaciones normalmente
      alert("No se pudo guardar. Revisa consola y laravel.log.");
    }
  }

  async function remove(row) {
    const ok = confirm("¿Eliminar departamento?");
    if (!ok) return;

    try {
      await deleteDepartamento(row?.id);
      await load();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar. Revisa consola y laravel.log.");
    }
  }

  const columns = [
    {
      key: "depa",
      header: "Departamento",
      render: (r) => (
        <div className="space-y-1">
          <div className="font-semibold text-white">{r?.depa ?? "—"}</div>
          <div className="text-xs text-slate-400">Código: {r?.codigo ?? "—"}</div>
        </div>
      ),
    },
    {
      key: "moroso",
      header: "Moroso",
      render: (r) =>
        r?.moroso ? <Badge tone="rose">Sí</Badge> : <Badge tone="emerald">No</Badge>,
    },
    {
      key: "acciones",
      header: "Acciones",
      render: (r) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" onClick={() => openEdit(r)}>
            Editar
          </Button>
          <Button size="sm" tone="danger" onClick={() => remove(r)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const rows = filtered.map((r) => ({
    __key: r?.id ?? Math.random(),
    ...r,
  }));

  return (
    <div className="space-y-4">
      <Card
        title="Departamentos"
        subtitle="CRUD de departamentos (depa, codigo, moroso)"
        right={<Button onClick={openCreate}>+ Nuevo</Button>}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="sm:max-w-sm w-full">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por depa o código..."
            />
          </div>

          <div className="text-xs text-slate-400">
            {loading ? "Cargando..." : `${filtered.length} departamento(s)`}
          </div>
        </div>

        <div className="mt-4">
          <Table
            columns={columns}
            rows={rows}
            emptyText={loading ? "Cargando..." : "Aún no hay departamentos"}
          />
        </div>
      </Card>

      <Modal
        open={open}
        title={mode === "create" ? "Nuevo departamento" : "Editar departamento"}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Departamento (depa)"
              value={form.depa}
              onChange={(e) => setForm((f) => ({ ...f, depa: e.target.value }))}
              placeholder="Ej. A-101"
              required
            />
            <Input
              label="Código"
              value={form.codigo}
              onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value }))}
              placeholder="Ej. DEP-101"
              required
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={form.moroso}
              onChange={(e) => setForm((f) => ({ ...f, moroso: e.target.checked }))}
            />
            Moroso
          </label>

          <div className="flex justify-end gap-2">
            <Button type="button" tone="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

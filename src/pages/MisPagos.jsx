import { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Modal from "../components/ui/Modal.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

import {
  listMisPagos,
  seedMisPagosIfEmpty,
  createMiPago,
  updateMiPago,
  deleteMiPago,
} from "../api/misPagos.mock.js";

export default function MisPagos() {
  const { me } = useAuth();
  const userId = me?.id || 1;

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    (async () => {
      await seedMisPagosIfEmpty(userId);
      const data = await listMisPagos();
      setRows(data.filter((x) => (x.userId || userId) === userId));
    })();
  }, [userId]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => {
      const text = `${r.mes} ${r.concepto} ${r.status}`.toLowerCase();
      return text.includes(s);
    });
  }, [q, rows]);

  const resumen = useMemo(() => {
    const total = rows.reduce((acc, r) => acc + Number(r.monto || 0), 0);
    const pagado = rows.filter((r) => r.status === "pagado").reduce((acc, r) => acc + Number(r.monto || 0), 0);
    const pendiente = rows.filter((r) => r.status === "pendiente").reduce((acc, r) => acc + Number(r.monto || 0), 0);
    const atrasado = rows.filter((r) => r.status === "atrasado").reduce((acc, r) => acc + Number(r.monto || 0), 0);
    return { total, pagado, pendiente, atrasado };
  }, [rows]);

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm());
    setOpen(true);
  };

  const openEdit = (r) => {
    setMode("edit");
    setEditingId(r.id);
    setForm({
      mes: r.mes || "",
      concepto: r.concepto || "Mantenimiento",
      monto: String(r.monto ?? ""),
      status: r.status || "pendiente",
      fecha: r.fecha || "",
    });
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      userId,
      mes: form.mes.trim(),
      concepto: form.concepto.trim(),
      monto: Number(form.monto || 0),
      status: form.status,
      fecha: form.status === "pagado" ? (form.fecha || new Date().toISOString().slice(0, 10)) : null,
    };

    if (!payload.mes || !payload.concepto || !payload.monto) return;

    if (mode === "create") {
      const created = await createMiPago(payload);
      setRows((prev) => [created, ...prev]);
    } else {
      const updated = await updateMiPago(editingId, payload);
      setRows((prev) => prev.map((x) => (x.id === editingId ? updated : x)));
    }

    setOpen(false);
  };

  const removeRow = async (id) => {
    await deleteMiPago(id);
    setRows((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card
            title="Mis pagos"
            subtitle="Historial de mensualidades (mock por ahora)"
            right={
              <button
                onClick={openCreate}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-900/40"
              >
                + Registrar pago
              </button>
            }
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por mes, concepto o estatus…"
                className="w-full sm:max-w-md rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm outline-none focus:border-slate-600"
              />

              <div className="text-xs text-slate-500">
                Mostrando <span className="text-slate-200 font-semibold">{filtered.length}</span> de{" "}
                <span className="text-slate-200 font-semibold">{rows.length}</span>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-900/30 text-slate-300">
                    <tr>
                      <Th>Mes</Th>
                      <Th>Concepto</Th>
                      <Th>Monto</Th>
                      <Th>Estatus</Th>
                      <Th>Fecha</Th>
                      <Th className="text-right">Acciones</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400">
                          No hay pagos todavía.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-900/20 transition">
                          <Td>
                            <div className="font-semibold text-white">{r.mes}</div>
                            <div className="text-xs text-slate-500">ID #{r.id}</div>
                          </Td>
                          <Td className="text-slate-200">{r.concepto}</Td>
                          <Td className="text-slate-200">${Number(r.monto).toFixed(2)}</Td>
                          <Td><StatusBadge status={r.status} /></Td>
                          <Td className="text-slate-300">{r.fecha || "—"}</Td>
                          <Td className="text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEdit(r)}
                                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900/40"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => removeRow(r.id)}
                                className="rounded-xl border border-red-900/60 bg-red-950/30 px-3 py-1.5 text-xs text-red-200 hover:bg-red-950/50"
                              >
                                Eliminar
                              </button>
                            </div>
                          </Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        <Card title="Resumen" subtitle="Totales">
          <div className="space-y-3 text-sm">
            <Row label="Total" value={`$${resumen.total.toFixed(2)}`} tone="slate" />
            <Row label="Pagado" value={`$${resumen.pagado.toFixed(2)}`} tone="emerald" />
            <Row label="Pendiente" value={`$${resumen.pendiente.toFixed(2)}`} tone="sky" />
            <Row label="Atrasado" value={`$${resumen.atrasado.toFixed(2)}`} tone="amber" />
          </div>
        </Card>
      </div>

      <Modal
        open={open}
        title={mode === "create" ? "Registrar pago" : "Editar pago"}
        onClose={() => setOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900/40"
            >
              Cancelar
            </button>
            <button
              onClick={save}
              className="rounded-xl border border-slate-700 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
            >
              Guardar
            </button>
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Mes (Ej: Febrero 2026)">
            <input
              value={form.mes}
              onChange={(e) => setForm({ ...form, mes: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-slate-600"
            />
          </Field>

          <Field label="Concepto">
            <input
              value={form.concepto}
              onChange={(e) => setForm({ ...form, concepto: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-slate-600"
            />
          </Field>

          <Field label="Monto">
            <input
              value={form.monto}
              onChange={(e) => setForm({ ...form, monto: e.target.value })}
              type="number"
              min="1"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-slate-600"
            />
          </Field>

          <Field label="Estatus">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-slate-600"
            >
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
              <option value="atrasado">Atrasado</option>
            </select>
          </Field>

          <Field label="Fecha (solo si Pagado)" className="sm:col-span-2">
            <input
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              type="date"
              disabled={form.status !== "pagado"}
              className={[
                "w-full rounded-xl border px-3 py-2 text-sm outline-none",
                form.status !== "pagado"
                  ? "border-slate-900 bg-slate-950/40 text-slate-600"
                  : "border-slate-800 bg-slate-950 text-slate-100 focus:border-slate-600",
              ].join(" ")}
            />
          </Field>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          Si marcas “Pagado” y dejas fecha vacía, se pondrá la fecha de hoy automáticamente.
        </div>
      </Modal>
    </div>
  );
}

function emptyForm() {
  return {
    mes: "",
    concepto: "Mantenimiento",
    monto: "1200",
    status: "pendiente",
    fecha: "",
  };
}

function StatusBadge({ status }) {
  if (status === "pagado") return <Badge tone="emerald">Pagado</Badge>;
  if (status === "pendiente") return <Badge tone="sky">Pendiente</Badge>;
  return <Badge tone="amber">Atrasado</Badge>;
}

function Row({ label, value, tone = "slate" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <Badge tone={tone}>{value}</Badge>
    </div>
  );
}

function Th({ children, className = "" }) {
  return (
    <th className={["px-4 py-3 text-left text-xs font-semibold", className].join(" ")}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={["px-4 py-3 align-top text-slate-200", className].join(" ")}>{children}</td>;
}
function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="text-xs text-slate-400">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

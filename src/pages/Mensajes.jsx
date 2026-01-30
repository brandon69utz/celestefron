import { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Badge from "../components/ui/Badge.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

import { getMensajes, createMensaje, marcarLeido } from "../api/mensajes.js";

export default function Mensajes() {
  const { me } = useAuth();
  const admin = !!me?.admin;

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // composer
  const [toDep, setToDep] = useState(""); // para admin (ej: "A-101")
  const [text, setText] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await safeGetMensajes();
      const normalized = (Array.isArray(data) ? data : []).map(normalizeMsg);
      normalized.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setItems(normalized);

      // seleccionar primero si no hay
      if (!selectedId && normalized.length > 0) setSelectedId(normalized[0].id);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((m) => {
      const hay =
        `${m.subject} ${m.body} ${m.from_label} ${m.to_label}`.toLowerCase();
      return hay.includes(s);
    });
  }, [q, items]);

  const selected = useMemo(
    () => items.find((m) => m.id === selectedId) || null,
    [items, selectedId]
  );

  const unreadCount = useMemo(
    () => items.filter((m) => !m.read).length,
    [items]
  );

  async function onSelect(m) {
    setSelectedId(m.id);
    if (!m.read) {
      // marcar leído (optimista)
      setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
      try {
        await safeMarcarLeido(m.id);
      } catch (e) {
        // si falla, no pasa nada, ya lo dejamos leído en UI
      }
    }
  }

  async function send(e) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const payload = {
        subject: admin ? `Mensaje a ${toDep || "Departamento"}` : "Mensaje",
        body: text.trim(),
        // en backend real: manda depto destino o id
        to_label: admin ? (toDep || "Departamento") : "Administración",
      };

      const created = await safeCreateMensaje(payload, me);
      const msg = normalizeMsg(created);

      setItems((prev) => [msg, ...prev]);
      setSelectedId(msg.id);
      setText("");
      setToDep("");
    } catch (err) {
      console.error(err);
      alert("No se pudo enviar. Revisa consola/backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      {/* LEFT: Inbox */}
      <Card
        title="Mensajes"
        subtitle="Bandeja de entrada"
        right={<Badge tone={unreadCount ? "amber" : "slate"}>{unreadCount} sin leer</Badge>}
      >
        <div className="space-y-3">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar mensajes..."
          />

          <div className="space-y-2 max-h-[62vh] overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="text-sm text-slate-400 py-6 text-center">
                {loading ? "Cargando..." : "No hay mensajes"}
              </div>
            ) : (
              filtered.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSelect(m)}
                  className={[
                    "w-full text-left rounded-2xl border p-3 transition",
                    m.id === selectedId
                      ? "border-slate-700 bg-white/5"
                      : "border-slate-800 bg-slate-900/20 hover:bg-white/5",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white truncate">
                          {m.subject}
                        </span>
                        {!m.read && <span className="h-2 w-2 rounded-full bg-amber-400" />}
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-1">
                        {m.from_label} → {m.to_label}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(m.created_at)}
                    </div>
                  </div>

                  <div className="text-sm text-slate-300 truncate mt-2">
                    {m.body}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* RIGHT: Conversation */}
      <div className="space-y-4">
        <Card
          title={selected ? selected.subject : "Selecciona un mensaje"}
          subtitle={selected ? `${selected.from_label} → ${selected.to_label}` : " "}
          right={
            selected ? (
              <Badge tone={selected.read ? "emerald" : "amber"}>
                {selected.read ? "Leído" : "Sin leer"}
              </Badge>
            ) : null
          }
        >
          {selected ? (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                {formatDateLong(selected.created_at)}
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4 text-slate-100">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {selected.body}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400 py-6">
              Elige un mensaje del lado izquierdo.
            </div>
          )}
        </Card>

        {/* Composer */}
        <Card
          title={admin ? "Enviar mensaje a un departamento" : "Enviar mensaje a administración"}
          subtitle="Escribe un mensaje y envíalo"
        >
          <form onSubmit={send} className="space-y-3">
            {admin && (
              <Input
                label="Departamento destino"
                value={toDep}
                onChange={(e) => setToDep(e.target.value)}
                placeholder="Ej. A-101"
              />
            )}

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="w-full min-h-[120px] rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-3 text-sm text-slate-100 outline-none focus:border-slate-600"
            />

            <div className="flex justify-end gap-2">
              <Button type="button" tone="ghost" onClick={() => setText("")}>
                Limpiar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

/* =========================
   Normalización + Utils
   ========================= */

function normalizeMsg(raw) {
  // soporta backend o fallback
  const id = raw?.id ?? raw?.message_id ?? Date.now();
  const subject = raw?.subject ?? "Mensaje";
  const body = raw?.body ?? raw?.mensaje ?? "";
  const read = raw?.read ?? raw?.leido ?? false;

  const created_at =
    raw?.created_at ??
    raw?.fecha ??
    new Date().toISOString();

  const from_label =
    raw?.from_label ??
    raw?.from ??
    raw?.emisor ??
    "Usuario";

  const to_label =
    raw?.to_label ??
    raw?.to ??
    raw?.destino ??
    "Administración";

  return { id, subject, body, read, created_at, from_label, to_label };
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
  } catch {
    return "";
  }
}

function formatDateLong(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso || "";
  }
}

/* =========================
   Fallbacks (si backend no está)
   ========================= */

async function safeGetMensajes() {
  try {
    return await getMensajes();
  } catch (e) {
    const raw = localStorage.getItem("mensajes");
    return raw ? JSON.parse(raw) : demoMensajes();
  }
}

async function safeCreateMensaje(payload, me) {
  try {
    return await createMensaje(payload);
  } catch (e) {
    const raw = localStorage.getItem("mensajes");
    const arr = raw ? JSON.parse(raw) : demoMensajes();

    const persona = me?.persona;
    const from = persona
      ? `${persona.nombre ?? ""} ${persona.apellido_p ?? ""}`.trim()
      : "Usuario";

    const msg = {
      id: Date.now(),
      subject: payload.subject || "Mensaje",
      body: payload.body || "",
      read: true, // el que envía lo ve leído
      created_at: new Date().toISOString(),
      from_label: from,
      to_label: payload.to_label || "Administración",
    };

    arr.unshift(msg);
    localStorage.setItem("mensajes", JSON.stringify(arr));
    return msg;
  }
}

async function safeMarcarLeido(id) {
  try {
    return await marcarLeido(id);
  } catch (e) {
    const raw = localStorage.getItem("mensajes");
    const arr = raw ? JSON.parse(raw) : [];
    const idx = arr.findIndex((x) => (x.id ?? x.message_id) === id);
    if (idx >= 0) arr[idx].read = true;
    localStorage.setItem("mensajes", JSON.stringify(arr));
    return true;
  }
}

function demoMensajes() {
  return [
    {
      id: 1001,
      subject: "Aviso: Mantenimiento de elevador",
      body: "El jueves habrá mantenimiento del elevador de 10:00 a 13:00.",
      read: false,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      from_label: "Administración",
      to_label: "Todos",
    },
    {
      id: 1002,
      subject: "Pago de mantenimiento",
      body: "Recuerda que la cuota vence el día 5 de cada mes.",
      read: true,
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      from_label: "Administración",
      to_label: "Residentes",
    },
  ];
}

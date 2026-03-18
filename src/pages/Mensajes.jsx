import { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Badge from "../components/ui/Badge.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import socket from "../socket";

export default function Mensajes() {
  const { me } = useAuth();
  const admin = !!me?.admin;

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [toDep, setToDep] = useState("");
  const [text, setText] = useState("");

  const userName = me?.persona
    ? `${me.persona.nombre ?? ""} ${me.persona.apellido_p ?? ""}`.trim()
    : "Usuario";

  const departamentoLabel =
    me?.departamento?.numero ||
    me?.departamento?.nombre ||
    "";

  useEffect(() => {
    if (!me) return;

    setLoading(true);

    socket.emit("unirse_chat", {
      userId: me.id,
      admin,
      userName,
      departamentoLabel: admin ? "" : String(departamentoLabel || ""),
    });

    const handleHistory = (history) => {
      const normalized = (Array.isArray(history) ? history : [])
        .map((m) => normalizeMsg(m, me))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setItems(normalized);
      setSelectedId((prev) => prev ?? (normalized[0]?.id ?? null));
      setLoading(false);
    };

    const handleNewMessage = (raw) => {
      const msg = normalizeMsg(raw, me);

      if (!admin) {
        const dep = String(departamentoLabel || "").trim().toLowerCase();
        const from = String(msg.from_label || "").trim().toLowerCase();
        const to = String(msg.to_label || "").trim().toLowerCase();

        const esParaMiDepartamento =
          raw?.sender_admin === true ||
          (dep && from === dep) ||
          (dep && to === dep) ||
          raw?.sender_user_id === me?.id;

        if (!esParaMiDepartamento) return;
      }

      setItems((prev) => {
        const next = [msg, ...prev.filter((x) => x.id !== msg.id)];
        next.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return next;
      });

      setSelectedId((prev) => prev ?? msg.id);
    };

    const handleChatError = (err) => {
      console.error("CHAT ERROR:", err);
      alert(err?.message || "No se pudo procesar el mensaje.");
      setLoading(false);
    };

    socket.on("chat_historial", handleHistory);
    socket.on("nuevo_mensaje", handleNewMessage);
    socket.on("chat_error", handleChatError);

    return () => {
      socket.off("chat_historial", handleHistory);
      socket.off("nuevo_mensaje", handleNewMessage);
      socket.off("chat_error", handleChatError);
    };
  }, [me, admin, userName, departamentoLabel]);

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

  function onSelect(m) {
    setSelectedId(m.id);
    if (!m.read) {
      setItems((prev) =>
        prev.map((x) => (x.id === m.id ? { ...x, read: true } : x))
      );
    }
  }

  function send(e) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);

    socket.emit("enviar_mensaje", {
      subject: admin ? `Mensaje a ${toDep || "Departamento"}` : "Mensaje",
      body: text.trim(),
      to_label: admin ? (toDep || "Departamento") : "Administración",
    });

    setText("");
    setToDep("");
    setLoading(false);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card
        title="Mensajes"
        subtitle="Bandeja de entrada"
        right={
          <Badge tone={unreadCount ? "amber" : "slate"}>
            {unreadCount} sin leer
          </Badge>
        }
      >
        <div className="space-y-3">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar mensajes..."
          />

          <div className="max-h-[62vh] space-y-2 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">
                {loading ? "Cargando..." : "No hay mensajes"}
              </div>
            ) : (
              filtered.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSelect(m)}
                  className={[
                    "w-full rounded-2xl border p-3 text-left transition",
                    m.id === selectedId
                      ? "border-blue-300 bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-semibold text-slate-900">
                          {m.subject}
                        </span>
                        {!m.read && (
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                        )}
                      </div>
                      <div className="mt-1 truncate text-xs text-slate-500">
                        {m.from_label} → {m.to_label}
                      </div>
                    </div>
                    <div className="whitespace-nowrap text-xs text-slate-400">
                      {formatDate(m.created_at)}
                    </div>
                  </div>

                  <div className="mt-2 truncate text-sm text-slate-700">
                    {m.body}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </Card>

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
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {selected.body}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-6 text-sm text-slate-500">
              Elige un mensaje del lado izquierdo.
            </div>
          )}
        </Card>

        <Card
          title={
            admin
              ? "Enviar mensaje a un departamento"
              : "Enviar mensaje a administración"
          }
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
              className="min-h-[120px] w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-blue-400"
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

function normalizeMsg(raw, me) {
  const id = raw?.id ?? raw?.message_id ?? Date.now();
  const subject = raw?.subject ?? "Mensaje";
  const body = raw?.body ?? raw?.mensaje ?? "";
  const created_at = raw?.created_at ?? raw?.fecha ?? new Date().toISOString();

  const from_label =
    raw?.from_label ?? raw?.from ?? raw?.emisor ?? "Usuario";

  const to_label =
    raw?.to_label ?? raw?.to ?? raw?.destino ?? "Administración";

  const isMine = raw?.sender_user_id === me?.id;
  const read = isMine ? true : raw?.read ?? raw?.leido ?? false;

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
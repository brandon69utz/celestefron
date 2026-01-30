import { dbGet, dbSet } from "./storage.js";

const TABLE = "avisos";

export async function listAvisos() {
  return dbGet(TABLE);
}

export async function seedAvisosIfEmpty(userId = 1) {
  const data = dbGet(TABLE);
  if (data && data.length > 0) return data;

  const seed = [
    {
      id: 1,
      userId,
      tipo: "asamblea",
      titulo: "Asamblea general",
      mensaje: "Se convoca a asamblea el viernes 7:00 pm. Tema: presupuesto 2026.",
      prioridad: "alta",
      fecha: "2026-01-28",
      leido: false,
    },
    {
      id: 2,
      userId,
      tipo: "pago",
      titulo: "Pago pendiente",
      mensaje: "Tu mensualidad de Febrero 2026 está pendiente.",
      prioridad: "media",
      fecha: "2026-01-20",
      leido: false,
    },
    {
      id: 3,
      userId,
      tipo: "general",
      titulo: "Mantenimiento elevador",
      mensaje: "El elevador estará en mantenimiento este sábado de 10am a 2pm.",
      prioridad: "baja",
      fecha: "2026-01-18",
      leido: true,
    },
  ];

  dbSet(TABLE, seed);
  return seed;
}

export async function createAviso(payload) {
  const prev = dbGet(TABLE);
  const nextId = Math.max(0, ...prev.map((x) => x.id || 0)) + 1;
  const row = { id: nextId, ...payload };
  dbSet(TABLE, [row, ...prev]);
  return row;
}

export async function updateAviso(id, payload) {
  const prev = dbGet(TABLE);
  const next = prev.map((x) => (x.id === id ? { ...x, ...payload } : x));
  dbSet(TABLE, next);
  return next.find((x) => x.id === id);
}

export async function deleteAviso(id) {
  const prev = dbGet(TABLE);
  dbSet(TABLE, prev.filter((x) => x.id !== id));
  return true;
}

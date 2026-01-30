import { dbGet, dbSet } from "./storage.js";

const TABLE = "departamentos";

export async function listDepartamentos() {
  return dbGet(TABLE);
}

export async function createDepartamento(payload) {
  const prev = dbGet(TABLE);
  const nextId = Math.max(0, ...prev.map((x) => x.id || 0)) + 1;
  const row = { id: nextId, ...payload };
  dbSet(TABLE, [row, ...prev]);
  return row;
}

export async function updateDepartamento(id, payload) {
  const prev = dbGet(TABLE);
  const next = prev.map((x) => (x.id === id ? { ...x, ...payload } : x));
  dbSet(TABLE, next);
  return next.find((x) => x.id === id);
}

export async function deleteDepartamento(id) {
  const prev = dbGet(TABLE);
  dbSet(TABLE, prev.filter((x) => x.id !== id));
  return true;
}

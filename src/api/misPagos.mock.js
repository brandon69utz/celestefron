import { dbGet, dbSet } from "./storage.js";

const TABLE = "mis_pagos";

export async function listMisPagos() {
  return dbGet(TABLE);
}

export async function seedMisPagosIfEmpty(userId = 1) {
  const data = dbGet(TABLE);
  if (data && data.length > 0) return data;

  const seed = [
    { id: 1, userId, mes: "Enero 2026", concepto: "Mantenimiento", monto: 1200, status: "pagado", fecha: "2026-01-05" },
    { id: 2, userId, mes: "Febrero 2026", concepto: "Mantenimiento", monto: 1200, status: "pendiente", fecha: null },
    { id: 3, userId, mes: "Diciembre 2025", concepto: "Mantenimiento", monto: 1200, status: "atrasado", fecha: null },
  ];

  dbSet(TABLE, seed);
  return seed;
}

export async function createMiPago(payload) {
  const prev = dbGet(TABLE);
  const nextId = Math.max(0, ...prev.map((x) => x.id || 0)) + 1;
  const row = { id: nextId, ...payload };
  dbSet(TABLE, [row, ...prev]);
  return row;
}

export async function updateMiPago(id, payload) {
  const prev = dbGet(TABLE);
  const next = prev.map((x) => (x.id === id ? { ...x, ...payload } : x));
  dbSet(TABLE, next);
  return next.find((x) => x.id === id);
}

export async function deleteMiPago(id) {
  const prev = dbGet(TABLE);
  dbSet(TABLE, prev.filter((x) => x.id !== id));
  return true;
}

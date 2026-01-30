export function normalizeUser(me) {
  return {
    id: me?.id ?? null,
    admin: !!me?.admin,
    nombre: me?.persona?.nombre ?? "",
    apellido: me?.persona?.apellido_p ?? "",
    email: me?.persona?.email ?? "",
  };
}

export function initials(nombre, apellido) {
  const a = (nombre ?? "").trim().slice(0, 1).toUpperCase();
  const b = (apellido ?? "").trim().slice(0, 1).toUpperCase();
  const out = (a + b).trim();
  return out.length ? out : "U";
}

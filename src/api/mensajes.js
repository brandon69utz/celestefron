import http from "./http";

// ✅ Si tu backend lo tiene: GET /mensajes
export async function getMensajes() {
  const { data } = await http.get("/mensajes");
  return data;
}

// ✅ POST /mensajes
export async function createMensaje(payload) {
  const { data } = await http.post("/mensajes", payload);
  return data;
}

// ✅ PUT /mensajes/:id/leer  (opcional)
export async function marcarLeido(id) {
  const { data } = await http.put(`/mensajes/${id}/leer`);
  return data;
}

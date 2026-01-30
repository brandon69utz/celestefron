import http from "./http";

// GET /departamentos
export async function getDepartamentos() {
  const { data } = await http.get("/departamentos");
  return data;
}

// POST /departamentos
export async function createDepartamento(payload) {
  const { data } = await http.post("/departamentos", payload);
  return data;
}

// PUT /departamentos/:id
export async function updateDepartamento(id, payload) {
  const { data } = await http.put(`/departamentos/${id}`, payload);
  return data;
}

// DELETE /departamentos/:id
export async function deleteDepartamento(id) {
  const { data } = await http.delete(`/departamentos/${id}`);
  return data;
}

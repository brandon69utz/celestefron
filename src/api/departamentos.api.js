import http from "./http"; // tu src/api/http.js (ya lo tienes)

const PATH = "/departamentos"; // si tu backend usa otra ruta, cámbiala aquí

export async function listDepartamentos() {
  const { data } = await http.get(PATH);
  return data;
}

export async function createDepartamento(payload) {
  const { data } = await http.post(PATH, payload);
  return data;
}

export async function updateDepartamento(id, payload) {
  const { data } = await http.put(`${PATH}/${id}`, payload);
  return data;
}

export async function deleteDepartamento(id) {
  const { data } = await http.delete(`${PATH}/${id}`);
  return data;
}

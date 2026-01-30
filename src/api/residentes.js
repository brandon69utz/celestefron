import http from "./http";

const PATH = "/residentes";

export async function getResidentes() {
  const { data } = await http.get(PATH);
  return data;
}

export async function createResidente(payload) {
  const { data } = await http.post(PATH, payload);
  return data;
}

export async function updateResidente(id, payload) {
  const { data } = await http.put(`${PATH}/${id}`, payload);
  return data;
}

export async function deleteResidente(id) {
  const { data } = await http.delete(`${PATH}/${id}`);
  return data;
}

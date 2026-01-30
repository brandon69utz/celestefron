import http from "./http";

export const getPersonas = () => http.get("/personas");
export const createPersona = (data) => http.post("/personas", data);
export const updatePersona = (id, data) => http.put(`/personas/${id}`, data);
export const deletePersona = (id) => http.delete(`/personas/${id}`);

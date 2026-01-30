export const getUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const isAdmin = () => {
  const u = getUser();
  return !!u?.admin; // viene del backend (true/false)
};

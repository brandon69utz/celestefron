const KEY = "condominios_mock";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function dbGet(table) {
  const db = load();
  return db[table] || [];
}

export function dbSet(table, rows) {
  const db = load();
  db[table] = rows;
  save(db);
}

export default function RightPanel() {
  return (
    <div className="space-y-4">
      <Box title="Buscar">
        <input
          placeholder="Buscar..."
          className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </Box>

      <Box title="Categorías">
        <ul className="space-y-2 text-sm">
          {[
            "Generales",
            "Mantenimiento",
            "Pagos",
            "Avisos",
            "Sugerencias",
            "Incidencias",
          ].map((x) => (
            <li key={x} className="flex items-center justify-between">
              <span className="text-slate-700">{x}</span>
              <span className="text-xs text-slate-400">•</span>
            </li>
          ))}
        </ul>
      </Box>

      <Box title="Links">
        <div className="space-y-2 text-sm text-blue-600">
          <a className="block hover:underline" href="#">
            Reglamento
          </a>
          <a className="block hover:underline" href="#">
            Contacto
          </a>
          <a className="block hover:underline" href="#">
            Soporte
          </a>
        </div>
      </Box>
    </div>
  );
}

function Box({ title, children }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-3 py-2 text-sm font-semibold">
        {title}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

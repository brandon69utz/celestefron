import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";

const avisosMock = [
  {
    id: 1,
    titulo: "Pago de mantenimiento",
    mensaje: "Recuerda realizar tu pago antes del día 10.",
    tipo: "recordatorio",
    fecha: "2026-01-20",
  },
  {
    id: 2,
    titulo: "Asamblea general",
    mensaje: "Asamblea el día viernes a las 7:00 pm.",
    tipo: "evento",
    fecha: "2026-01-18",
  },
  {
    id: 3,
    titulo: "Corte de agua",
    mensaje: "Habrá corte de agua el sábado de 9 a 12 hrs.",
    tipo: "aviso",
    fecha: "2026-01-15",
  },
];

export default function Avisos() {
  return (
    <div className="space-y-4">
      <Card
        title="Avisos y notificaciones"
        subtitle="Comunicados del condominio"
      >
        <div className="space-y-3">
          {avisosMock.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-slate-800 bg-slate-900/30 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">{a.titulo}</h3>
                  <p className="mt-1 text-sm text-slate-400">{a.mensaje}</p>
                </div>

                <Badge tone={toneByType(a.tipo)}>
                  {a.tipo}
                </Badge>
              </div>

              <div className="mt-2 text-xs text-slate-500">
                {a.fecha}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function toneByType(tipo) {
  if (tipo === "evento") return "emerald";
  if (tipo === "recordatorio") return "amber";
  return "sky";
}

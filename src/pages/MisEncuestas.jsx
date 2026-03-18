import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import socket from "../socket";

export default function MisEncuestas() {
  const { me } = useAuth();
  const [encuesta, setEncuesta] = useState(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("");
  const [mensaje, setMensaje] = useState("");

  const departamentoId = me?.departamento_id || me?.departamento?.id || null;

  const departamentoNombre =
    me?.departamento?.numero ||
    me?.departamento?.nombre ||
    null;

  const identificadorFinal = departamentoId || me?.id || null;

  const nombreFinal =
    departamentoNombre ||
    (me?.persona
      ? `${me.persona.nombre ?? ""} ${me.persona.apellido_p ?? ""} ${me.persona.apellido_m ?? ""}`.trim()
      : null) ||
    `Usuario ${me?.id ?? ""}`;

  useEffect(() => {
    if (!me) return;

    socket.emit("unirse_como_departamento", {
      usuario_id: me.id,
      departamento_id: identificadorFinal,
      nombre: nombreFinal,
    });

    socket.on("encuesta_publicada", (data) => {
      setEncuesta(data);
      setOpcionSeleccionada("");
      setMensaje("");
    });

    socket.on("encuesta_eliminada", () => {
      setEncuesta(null);
      setOpcionSeleccionada("");
      setMensaje("La encuesta fue cerrada por el administrador.");
    });

    socket.on("respuesta_ok", (data) => {
      setMensaje(data.mensaje);
    });

    socket.on("respuesta_error", (data) => {
      setMensaje(data.mensaje);
    });

    return () => {
      socket.off("encuesta_publicada");
      socket.off("encuesta_eliminada");
      socket.off("respuesta_ok");
      socket.off("respuesta_error");
    };
  }, [me, identificadorFinal, nombreFinal]);

  const responderEncuesta = () => {
    if (!encuesta) {
      setMensaje("No hay encuesta activa.");
      return;
    }

    if (!opcionSeleccionada) {
      setMensaje("Selecciona una opción.");
      return;
    }

    socket.emit("responder_encuesta", {
      encuesta_id: encuesta.encuesta_id,
      usuario_id: me.id,
      departamento_id: identificadorFinal,
      departamento_nombre: nombreFinal,
      respuesta: opcionSeleccionada,
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-xl font-semibold">Mis encuestas</h1>
        <p className="mt-1 text-sm text-slate-500">
          Aquí puedes visualizar y responder las encuestas activas.
        </p>

        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
          <p>
            <strong>Usuario:</strong>{" "}
            {me?.persona
              ? `${me.persona.nombre ?? ""} ${me.persona.apellido_p ?? ""} ${me.persona.apellido_m ?? ""}`.trim()
              : "Usuario"}
          </p>
          <p>
            <strong>Identificador:</strong>{" "}
            {identificadorFinal ? nombreFinal : "Sin asignar"}
          </p>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        {encuesta ? (
          <>
            <h2 className="text-lg font-semibold">{encuesta.pregunta}</h2>

            <div className="mt-4 space-y-3">
              {encuesta.opciones.map((op, i) => (
                <label
                  key={i}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3 py-3 hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="respuesta"
                    value={op}
                    checked={opcionSeleccionada === op}
                    onChange={(e) => setOpcionSeleccionada(e.target.value)}
                  />
                  <span>{op}</span>
                </label>
              ))}
            </div>

            <button
              onClick={responderEncuesta}
              className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Enviar respuesta
            </button>
          </>
        ) : (
          <p className="text-sm text-slate-500">
            No hay encuestas activas en este momento.
          </p>
        )}

        {mensaje && (
          <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}
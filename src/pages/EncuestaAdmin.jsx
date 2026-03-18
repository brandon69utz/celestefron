import { useEffect, useState } from "react";
import socket from "../socket";
import ActionAlert from "../components/ui/ActionAlert.jsx";
import LoadingButton from "../components/ui/LoadingButton.jsx";
import useAsyncAction from "../hooks/useAsyncAction.js";

export default function EncuestaAdmin() {
  const [pregunta, setPregunta] = useState("");
  const [opciones, setOpciones] = useState(["", ""]);
  const [resultados, setResultados] = useState({
    encuesta: null,
    totalRespuestas: 0,
    respuestas: [],
    historial: [],
  });

  const {
    loading: actionLoading,
    alert,
    runAction,
    closeAlert,
  } = useAsyncAction();

  useEffect(() => {
    socket.emit("unirse_como_admin");

    socket.on("resultados_actualizados", (data) => {
      setResultados({
        encuesta: data?.encuesta ?? null,
        totalRespuestas: data?.totalRespuestas ?? 0,
        respuestas: data?.respuestas ?? [],
        historial: data?.historial ?? [],
      });
    });

    return () => {
      socket.off("resultados_actualizados");
    };
  }, []);

  const cambiarOpcion = (index, value) => {
    const nuevas = [...opciones];
    nuevas[index] = value;
    setOpciones(nuevas);
  };

  const agregarOpcion = () => {
    setOpciones([...opciones, ""]);
  };

  const publicarEncuesta = async () => {
    const opcionesLimpias = opciones.filter((op) => op.trim() !== "");

    if (!pregunta.trim()) {
      return closeAlert(),
      runAction({
        action: async () => {
          throw {
            response: {
              data: { message: "Escribe una pregunta." },
            },
          };
        },
        errorTitle: "No se pudo publicar",
      }).catch(() => {});
    }

    if (opcionesLimpias.length < 2) {
      return closeAlert(),
      runAction({
        action: async () => {
          throw {
            response: {
              data: { message: "Debes agregar al menos 2 opciones." },
            },
          };
        },
        errorTitle: "No se pudo publicar",
      }).catch(() => {});
    }

    const nuevaEncuesta = {
      encuesta_id: Date.now(),
      pregunta,
      opciones: opcionesLimpias,
    };

    try {
      await runAction({
        action: async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          socket.emit("publicar_encuesta", nuevaEncuesta);
          return true;
        },
        successTitle: "Encuesta publicada",
        successMessage: "La encuesta se publicó correctamente.",
        errorTitle: "No se pudo publicar",
      });

      setPregunta("");
      setOpciones(["", ""]);
    } catch (err) {
      console.error(err);
    }
  };

  const cerrarEncuesta = async () => {
    const ok = confirm("¿Seguro que deseas cerrar la encuesta actual?");
    if (!ok) return;

    try {
      await runAction({
        action: async () => {
          await new Promise((resolve) => setTimeout(resolve, 400));
          socket.emit("cerrar_encuesta");
          return true;
        },
        successTitle: "Encuesta cerrada",
        successMessage: "La encuesta actual fue cerrada correctamente.",
        errorTitle: "No se pudo cerrar",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarEncuesta = async (encuestaId) => {
    const ok = confirm("¿Seguro que deseas eliminar esta encuesta del historial?");
    if (!ok) return;

    try {
      await runAction({
        action: async () => {
          await new Promise((resolve) => setTimeout(resolve, 400));
          socket.emit("eliminar_encuesta_historial", {
            encuesta_id: encuestaId,
          });
          return true;
        },
        successTitle: "Encuesta eliminada",
        successMessage: "La encuesta fue eliminada del historial.",
        errorTitle: "No se pudo eliminar",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const contarVotos = (opcion) => {
    return resultados.respuestas.filter((r) => r.respuesta === opcion).length;
  };

  const contarVotosHistorial = (encuesta, opcion) => {
    return (encuesta.respuestas || []).filter((r) => r.respuesta === opcion)
      .length;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-xl font-semibold">Encuesta en vivo</h1>
        <p className="mt-1 text-sm text-slate-500">
          Publica, cierra y elimina encuestas desde el panel del administrador.
        </p>

        <div className="mt-4 space-y-3">
          <input
            type="text"
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            placeholder="Escribe la pregunta"
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />

          {opciones.map((op, i) => (
            <input
              key={i}
              type="text"
              value={op}
              onChange={(e) => cambiarOpcion(i, e.target.value)}
              placeholder={`Opción ${i + 1}`}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          ))}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={agregarOpcion}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Agregar opción
            </button>

            <LoadingButton
              loading={actionLoading}
              onClick={publicarEncuesta}
              className="bg-slate-900 text-white hover:bg-slate-800"
            >
              Publicar encuesta
            </LoadingButton>

            {resultados.encuesta && (
              <LoadingButton
                loading={actionLoading}
                onClick={cerrarEncuesta}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Cerrar encuesta actual
              </LoadingButton>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Encuesta activa</h2>

        {resultados.encuesta ? (
          <div className="mt-4 space-y-3">
            <p>
              <strong>Pregunta:</strong> {resultados.encuesta.pregunta}
            </p>
            <p>
              <strong>Total respuestas:</strong> {resultados.totalRespuestas}
            </p>

            <div className="space-y-2">
              {resultados.encuesta.opciones.map((op, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
                >
                  <span>{op}</span>
                  <strong>{contarVotos(op)}</strong>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <h3 className="font-semibold">Detalle de respuestas</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                {resultados.respuestas.length > 0 ? (
                  resultados.respuestas.map((r, i) => (
                    <li
                      key={i}
                      className="rounded-md border border-slate-200 px-3 py-2"
                    >
                      {r.departamento_nombre} respondió:{" "}
                      <strong>{r.respuesta}</strong>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">Aún no hay respuestas.</li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            No hay encuesta activa en este momento.
          </p>
        )}
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Historial de encuestas</h2>

        {resultados.historial.length > 0 ? (
          <div className="mt-4 space-y-4">
            {resultados.historial.map((encuesta) => (
              <div
                key={encuesta.encuesta_id}
                className="rounded-md border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{encuesta.pregunta}</p>
                    <p className="text-sm text-slate-500">
                      Estado:{" "}
                      {encuesta.status === "activa" ? "Activa" : "Cerrada"}
                    </p>
                    <p className="text-sm text-slate-500">
                      Total respuestas: {encuesta.totalRespuestas ?? 0}
                    </p>
                  </div>

                  <LoadingButton
                    loading={actionLoading}
                    onClick={() => eliminarEncuesta(encuesta.encuesta_id)}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Eliminar
                  </LoadingButton>
                </div>

                <div className="mt-3 space-y-2">
                  {(encuesta.opciones || []).map((op, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
                    >
                      <span>{op}</span>
                      <strong>{contarVotosHistorial(encuesta, op)}</strong>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <h3 className="font-medium">Respuestas</h3>
                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    {(encuesta.respuestas || []).length > 0 ? (
                      encuesta.respuestas.map((r, i) => (
                        <li
                          key={i}
                          className="rounded-md border border-slate-200 px-3 py-2"
                        >
                          {r.departamento_nombre} respondió:{" "}
                          <strong>{r.respuesta}</strong>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">Sin respuestas.</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            No hay encuestas guardadas en el historial.
          </p>
        )}
      </div>

      <ActionAlert
        open={alert.open}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />
    </div>
  );
}
import { useEffect, useState } from "react";
import socket from "../socket";

export default function EncuestaDepartamento() {
  const [departamentoId, setDepartamentoId] = useState("");
  const [nombreDepto, setNombreDepto] = useState("");
  const [conectado, setConectado] = useState(false);
  const [encuesta, setEncuesta] = useState(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("");

  useEffect(() => {
    socket.on("encuesta_publicada", (data) => {
      setEncuesta(data);
    });

    socket.on("respuesta_ok", (data) => {
      alert(data.mensaje);
    });

    socket.on("respuesta_error", (data) => {
      alert(data.mensaje);
    });

    return () => {
      socket.off("encuesta_publicada");
      socket.off("respuesta_ok");
      socket.off("respuesta_error");
    };
  }, []);

  const conectarDepartamento = () => {
    if (!departamentoId.trim() || !nombreDepto.trim()) {
      alert("Completa el ID y el nombre del departamento");
      return;
    }

    socket.emit("unirse_como_departamento", {
      departamento_id: departamentoId,
      nombre: nombreDepto,
    });

    setConectado(true);
  };

  const responderEncuesta = () => {
    if (!encuesta) {
      alert("No hay encuesta activa");
      return;
    }

    if (!opcionSeleccionada) {
      alert("Selecciona una opción");
      return;
    }

    socket.emit("responder_encuesta", {
      encuesta_id: encuesta.encuesta_id,
      departamento_id: departamentoId,
      departamento_nombre: nombreDepto,
      respuesta: opcionSeleccionada,
    });
  };

  return (
    <div style={styles.container}>
      <h1>Encuesta en Vivo - Departamento</h1>

      <div style={styles.card}>
        {!conectado ? (
          <>
            <input
              type="text"
              placeholder="ID del departamento"
              value={departamentoId}
              onChange={(e) => setDepartamentoId(e.target.value)}
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Nombre del departamento"
              value={nombreDepto}
              onChange={(e) => setNombreDepto(e.target.value)}
              style={styles.input}
            />

            <button onClick={conectarDepartamento}>Entrar a encuesta</button>
          </>
        ) : (
          <>
            <p>
              Conectado como: <strong>{nombreDepto}</strong>
            </p>

            {encuesta ? (
              <div>
                <h2>{encuesta.pregunta}</h2>

                {encuesta.opciones.map((op, i) => (
                  <label key={i} style={styles.option}>
                    <input
                      type="radio"
                      name="respuesta"
                      value={op}
                      checked={opcionSeleccionada === op}
                      onChange={(e) => setOpcionSeleccionada(e.target.value)}
                    />
                    <span style={{ marginLeft: "8px" }}>{op}</span>
                  </label>
                ))}

                <button onClick={responderEncuesta}>Enviar respuesta</button>
              </div>
            ) : (
              <p>No hay encuesta activa en este momento.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    maxWidth: "700px",
    margin: "0 auto",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  option: {
    display: "block",
    marginBottom: "10px",
  },
};
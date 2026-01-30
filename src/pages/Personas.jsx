import { useEffect, useState } from "react";
import {
  getPersonas,
  createPersona,
  updatePersona,
  deletePersona,
} from "../api/personas";

import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Modal from "../components/ui/Modal.jsx";

export default function Personas() {
  const [personas, setPersonas] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    apellido_p: "",
    apellido_m: "",
    email: "",
    celular: "",
  });
  const [loading, setLoading] = useState(false);

  // Modal editar
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    apellido_p: "",
    apellido_m: "",
    email: "",
    celular: "",
  });

  const cargarPersonas = async () => {
    try {
      const { data } = await getPersonas();
      setPersonas(data);
    } catch (error) {
      console.error("Error al cargar personas", error);
    }
  };

  const guardarPersona = async () => {
    if (!form.nombre.trim() || !form.apellido_p.trim() || !form.email.trim())
      return;

    setLoading(true);
    try {
      await createPersona(form);
      setForm({
        nombre: "",
        apellido_p: "",
        apellido_m: "",
        email: "",
        celular: "",
      });
      await cargarPersonas();
    } catch (error) {
      console.error("Error al guardar persona", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirEditar = (p) => {
    setEditId(p.id);
    setEditForm({
      nombre: p.nombre ?? "",
      apellido_p: p.apellido_p ?? "",
      apellido_m: p.apellido_m ?? "",
      email: p.email ?? "",
      celular: p.celular ?? "",
    });
    setOpenEdit(true);
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    if (
      !editForm.nombre.trim() ||
      !editForm.apellido_p.trim() ||
      !editForm.email.trim()
    )
      return;

    setLoading(true);
    try {
      await updatePersona(editId, editForm);
      setOpenEdit(false);
      setEditId(null);
      await cargarPersonas();
    } catch (error) {
      console.error("Error al editar persona", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarPersona = async (id) => {
    if (!confirm("¿Eliminar persona?")) return;

    try {
      await deletePersona(id);
      await cargarPersonas();
    } catch (error) {
      console.error("Error al eliminar persona", error);
    }
  };

  useEffect(() => {
    cargarPersonas();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Personas</h1>

      {/* Crear */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 max-w-3xl">
        <Input
          label="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
        <Input
          label="Apellido paterno"
          value={form.apellido_p}
          onChange={(e) => setForm({ ...form, apellido_p: e.target.value })}
        />
        <Input
          label="Apellido materno"
          value={form.apellido_m}
          onChange={(e) => setForm({ ...form, apellido_m: e.target.value })}
        />
        <Input
          label="Correo"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Celular"
          value={form.celular}
          onChange={(e) => setForm({ ...form, celular: e.target.value })}
        />
      </div>

      <Button onClick={guardarPersona} disabled={loading}>
        {loading ? "Guardando..." : "Agregar persona"}
      </Button>

      {/* Tabla */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm border border-slate-800 rounded-xl overflow-hidden">
          <thead className="bg-slate-900">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Correo</th>
              <th className="p-3 text-left">Celular</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personas.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-500">
                  No hay personas registradas
                </td>
              </tr>
            )}

            {personas.map((p) => (
              <tr
                key={p.id}
                className="border-t border-slate-800 hover:bg-slate-900/50"
              >
                <td className="p-3">
                  {p.nombre} {p.apellido_p} {p.apellido_m ?? ""}
                </td>
                <td className="p-3">{p.email}</td>
                <td className="p-3">{p.celular ?? "-"}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="text-xs"
                      onClick={() => abrirEditar(p)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      className="text-xs"
                      onClick={() => eliminarPersona(p.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal editar */}
      <Modal
        open={openEdit}
        title="Editar Persona"
        onClose={() => setOpenEdit(false)}
      >
        <form onSubmit={guardarEdicion} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Nombre"
              value={editForm.nombre}
              onChange={(e) =>
                setEditForm({ ...editForm, nombre: e.target.value })
              }
            />
            <Input
              label="Apellido paterno"
              value={editForm.apellido_p}
              onChange={(e) =>
                setEditForm({ ...editForm, apellido_p: e.target.value })
              }
            />
            <Input
              label="Apellido materno"
              value={editForm.apellido_m}
              onChange={(e) =>
                setEditForm({ ...editForm, apellido_m: e.target.value })
              }
            />
            <Input
              label="Correo"
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
            />
            <Input
              label="Celular"
              value={editForm.celular}
              onChange={(e) =>
                setEditForm({ ...editForm, celular: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setOpenEdit(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

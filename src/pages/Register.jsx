import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../api/http";
import ActionAlert from "../components/ui/ActionAlert.jsx";
import LoadingButton from "../components/ui/LoadingButton.jsx";
import useAsyncAction from "../hooks/useAsyncAction.js";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido_p: "",
    apellido_m: "",
    email: "",
    celular: "",
    password: "",
    password_confirmation: "",
  });

  const { loading, alert, runAction, closeAlert } = useAsyncAction();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await runAction({
        action: async () => {
          const res = await http.post("/auth/register", form);
          return res.data;
        },
        successTitle: "Registro exitoso",
        successMessage:
          "Tu cuenta fue creada. Revisa tu correo para confirmar tu cuenta.",
        errorTitle: "No se pudo registrar",
        getErrorMessage: (err) => {
          const status = err?.response?.status;
          const data = err?.response?.data;
          const errors = data?.errors;

          console.log("REGISTER ERROR:", data || err);

          if (status === 422 && errors) {
            const firstError = Object.values(errors)?.[0]?.[0];
            return firstError || "Verifica los datos capturados.";
          }

          return data?.message || "No se pudo completar el registro.";
        },
        onSuccess: () => {
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 1500);
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/20 p-6 shadow-xl">
        <h1 className="text-xl font-semibold">Crear cuenta</h1>
        <p className="text-sm text-slate-400 mt-1">
          Registra tus datos para acceder al sistema.
        </p>

        <form onSubmit={submit} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={onChange}
              type="text"
              placeholder="Tu nombre"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:border-slate-600"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Apellido paterno</label>
            <input
              name="apellido_p"
              value={form.apellido_p}
              onChange={onChange}
              type="text"
              placeholder="Apellido paterno"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:border-slate-600"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Apellido materno</label>
            <input
              name="apellido_m"
              value={form.apellido_m}
              onChange={onChange}
              type="text"
              placeholder="Apellido materno"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:border-slate-600"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Celular</label>
            <input
              name="celular"
              value={form.celular}
              onChange={onChange}
              type="text"
              placeholder="3312345678"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:border-slate-600"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-slate-400">Correo</label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:border-slate-600"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Contraseña</label>
            <input
              name="password"
              value={form.password}
              onChange={onChange}
              type="password"
              placeholder="******"
              autoComplete="new-password"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:border-slate-600"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Confirmar contraseña</label>
            <input
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={onChange}
              type="password"
              placeholder="******"
              autoComplete="new-password"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:border-slate-600"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-3">
            <LoadingButton
              type="submit"
              loading={loading}
              className="w-full rounded-xl bg-white/10 hover:bg-white/15 border border-slate-700 text-white"
            >
              Registrarme
            </LoadingButton>

            <div className="text-sm text-slate-400 text-center">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="underline hover:text-white">
                Inicia sesión
              </Link>
            </div>
          </div>
        </form>
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
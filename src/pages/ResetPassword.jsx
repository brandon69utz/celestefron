import { useState } from "react";
import { Link } from "react-router-dom";
import http from "../api/http";
import ActionAlert from "../components/ui/ActionAlert.jsx";
import LoadingButton from "../components/ui/LoadingButton.jsx";
import useAsyncAction from "../hooks/useAsyncAction.js";

export default function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    code: "",
    password: "",
    password_confirmation: "",
  });

  const { loading, alert, runAction, closeAlert } = useAsyncAction();

  const submit = async (e) => {
    e.preventDefault();

    try {
      await runAction({
        action: () => http.post("/auth/reset-password", form),
        successTitle: "Contraseña actualizada",
        successMessage: "Ya puedes iniciar sesión con tu nueva contraseña.",
        errorTitle: "No se pudo restablecer la contraseña",
        getErrorMessage: (err) => {
          const data = err?.response?.data;
          if (data?.errors?.email?.[0]) return data.errors.email[0];
          if (data?.errors?.code?.[0]) return data.errors.code[0];
          if (data?.errors?.password?.[0]) return data.errors.password[0];
          return data?.message || "Ocurrió un error al restablecer la contraseña.";
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/20 p-6 shadow-xl">
        <h1 className="text-xl font-semibold">Restablecer contraseña</h1>
        <p className="mt-1 text-sm text-slate-400">
          Captura el correo, el código y tu nueva contraseña.
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <div>
            <label className="text-xs text-slate-400">Correo</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:border-slate-600"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              placeholder="correo@condominio.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Código de 6 dígitos</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:border-slate-600"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              type="text"
              maxLength={6}
              placeholder="123456"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Nueva contraseña</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:border-slate-600"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              placeholder="******"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Confirmar contraseña</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:border-slate-600"
              value={form.password_confirmation}
              onChange={(e) =>
                setForm({ ...form, password_confirmation: e.target.value })
              }
              type="password"
              placeholder="******"
              required
            />
          </div>

          <LoadingButton
            type="submit"
            loading={loading}
            className="w-full rounded-xl border border-slate-700 bg-white/10 text-white hover:bg-white/15"
          >
            Restablecer contraseña
          </LoadingButton>
        </form>

        <div className="mt-4 text-center text-sm text-slate-400">
          <Link to="/forgot-password" className="underline hover:text-white">
            Volver a enviar código
          </Link>
        </div>

        <div className="mt-2 text-center text-sm text-slate-400">
          <Link to="/login" className="underline hover:text-white">
            Volver al login
          </Link>
        </div>
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
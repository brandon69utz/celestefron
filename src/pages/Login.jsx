import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import ActionAlert from "../components/ui/ActionAlert.jsx";
import LoadingButton from "../components/ui/LoadingButton.jsx";
import useAsyncAction from "../hooks/useAsyncAction.js";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@condominio.com");
  const [password, setPassword] = useState("admin123");

  const { loading, alert, runAction, closeAlert } = useAsyncAction();

  const submit = async (e) => {
    e.preventDefault();

    try {
      await runAction({
        action: () => login(email, password),
        successTitle: "Sesión iniciada",
        successMessage: "Bienvenido al sistema.",
        errorTitle: "No se pudo iniciar sesión",
        getErrorMessage: (err) => {
          const status = err?.response?.status;
          const msg = err?.response?.data?.message;

          console.log("LOGIN ERROR:", err?.response?.data || err);

          if (status === 401 || status === 422) {
            return "Credenciales incorrectas.";
          }

          return msg ? `Error: ${msg}` : "No se pudo iniciar sesión.";
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/20 p-6 shadow-xl">
        <h1 className="text-xl font-semibold">Iniciar sesión</h1>
        <p className="text-sm text-slate-400 mt-1">
          Ingresa con tu correo y contraseña.
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <div>
            <label className="text-xs text-slate-400">Correo</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:border-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="correo@condominio.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Contraseña</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:border-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="********"
              autoComplete="current-password"
            />
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-slate-400 underline hover:text-white"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <LoadingButton
            type="submit"
            loading={loading}
            className="w-full rounded-xl bg-white/10 hover:bg-white/15 border border-slate-700 text-white"
          >
            Entrar
          </LoadingButton>
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
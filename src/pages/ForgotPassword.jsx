import { useState } from "react";
import { Link } from "react-router-dom";
import http from "../api/http";
import ActionAlert from "../components/ui/ActionAlert.jsx";
import LoadingButton from "../components/ui/LoadingButton.jsx";
import useAsyncAction from "../hooks/useAsyncAction.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { loading, alert, runAction, closeAlert } = useAsyncAction();

  const submit = async (e) => {
    e.preventDefault();

    try {
      await runAction({
        action: () =>
          http.post("/auth/forgot-password", {
            email,
          }),
        successTitle: "Código enviado",
        successMessage:
          "Se envió un código de recuperación a tu correo.",
        errorTitle: "No se pudo enviar el código",
        getErrorMessage: (err) => {
          const data = err?.response?.data;
          if (data?.errors?.email?.[0]) return data.errors.email[0];
          return data?.message || "Ocurrió un error al enviar el código.";
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/20 p-6 shadow-xl">
        <h1 className="text-xl font-semibold">Recuperar contraseña</h1>
        <p className="mt-1 text-sm text-slate-400">
          Escribe tu correo para enviarte un código de 6 dígitos.
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
              required
            />
          </div>

          <LoadingButton
            type="submit"
            loading={loading}
            className="w-full rounded-xl border border-slate-700 bg-white/10 text-white hover:bg-white/15"
          >
            Enviar código
          </LoadingButton>
        </form>

        <div className="mt-4 text-center text-sm text-slate-400">
          <Link to="/reset-password" className="underline hover:text-white">
            Ya tengo el código
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
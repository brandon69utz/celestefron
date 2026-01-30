import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@condominio.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      // redirige desde AuthContext
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      console.log("LOGIN ERROR:", err?.response?.data || err);

      if (status === 401) setError("Credenciales incorrectas.");
      else setError(msg ? `Error: ${msg}` : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
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
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Contraseña</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:border-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-white/10 hover:bg-white/15 border border-slate-700 px-4 py-2 font-semibold disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

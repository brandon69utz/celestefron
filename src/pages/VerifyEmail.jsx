import { Link, useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");
  const message =
    searchParams.get("message") ||
    "Tu correo ya fue procesado. Intenta iniciar sesión.";

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/20 p-6 shadow-xl text-center">
        <h1 className="text-xl font-semibold">
          {isSuccess ? "Correo verificado" : "Verificación de correo"}
        </h1>

        <p className="text-sm text-slate-400 mt-3">{message}</p>

        <div className="mt-6">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 border border-slate-700 px-4 py-2 text-white"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { me, loadingMe } = useAuth();

  if (loadingMe) return <div className="p-4 text-slate-300">Cargando...</div>;
  if (!me) return <Navigate to="/login" replace />;

  return children;
}
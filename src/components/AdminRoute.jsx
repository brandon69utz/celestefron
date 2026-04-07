import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { loadingMe, isAuthenticated, isAdmin } = useAuth();

  if (loadingMe) return <div className="p-4 text-slate-300">Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/app" replace />;

  return children;
}
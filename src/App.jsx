import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import ClassicLayout from "./layout/ClassicLayout.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

import AppDashboard from "./pages/AppDashboard.jsx";
import Residentes from "./pages/Residentes.jsx";
import Departamentos from "./pages/Departamentos.jsx";
import Pagos from "./pages/Pagos.jsx";
import Mensajes from "./pages/Mensajes.jsx";
import Eventos from "./pages/Eventos.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <ClassicLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AppDashboard />} />
        <Route path="mensajes" element={<Mensajes />} />

        <Route
          path="residentes"
          element={
            <AdminRoute>
              <Residentes />
            </AdminRoute>
          }
        />
        <Route
          path="departamentos"
          element={
            <AdminRoute>
              <Departamentos />
            </AdminRoute>
          }
        />
        <Route
          path="pagos"
          element={
            <AdminRoute>
              <Pagos />
            </AdminRoute>
          }
        />
        <Route
          path="eventos"
          element={
            <AdminRoute>
              <Eventos />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}

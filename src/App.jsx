import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ClassicLayout from "./layout/ClassicLayout.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

import AppDashboard from "./pages/AppDashboard.jsx";
import Residentes from "./pages/Residentes.jsx";
import Departamentos from "./pages/Departamentos.jsx";
import Pagos from "./pages/Pagos.jsx";
import Mensajes from "./pages/Mensajes.jsx";
import Eventos from "./pages/Eventos.jsx";

import EncuestaAdmin from "./pages/EncuestaAdmin.jsx";
import MisEncuestas from "./pages/MisEncuestas.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

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

        <Route
          path="encuesta-admin"
          element={
            <AdminRoute>
              <EncuestaAdmin />
            </AdminRoute>
          }
        />

        <Route path="mis-encuestas" element={<MisEncuestas />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
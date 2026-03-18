import { createContext, useContext, useEffect, useState } from "react";
import http from "../api/http";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingMe(false);
      return;
    }

    http
      .get("/auth/me")
      .then((res) => {
        setMe(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setMe(null);
      })
      .finally(() => setLoadingMe(false));
  }, []);

  const login = async (email, password) => {
    const res = await http.post("/auth/login", {
      email,
      password,
      device_name: "web",
    });

    localStorage.setItem("token", res.data.token);
    setMe(res.data.user);
    navigate("/app", { replace: true });
  };

  const logout = async () => {
    try {
      await http.post("/auth/logout");
    } catch {
    } finally {
      localStorage.removeItem("token");
      setMe(null);
      navigate("/login", { replace: true });
    }
  };

  const isAdmin = !!me?.admin;

  const departamentoId =
    me?.departamento_id ||
    me?.departamento?.id ||
    null;

  const departamentoNombre =
    me?.departamento?.nombre ||
    me?.departamento?.numero ||
    null;

  return (
    <AuthContext.Provider
      value={{
        me,
        login,
        logout,
        loadingMe,
        isAdmin,
        departamentoId,
        departamentoNombre,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
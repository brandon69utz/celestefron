import { createContext, useContext, useEffect, useState } from "react";
import http from "../api/http"; // tu axios configurado
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
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
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await http.post("/auth/login", {
      email,
      password,
      device_name: "web",
    });

    localStorage.setItem("token", res.data.token);
    setMe(res.data.user);
    navigate("/app/dashboard", { replace: true });
  };

  const logout = async () => {
    try {
      await http.post("/auth/logout");
    } catch {
      // backend pendiente, no pasa nada
    } finally {
      localStorage.removeItem("token");
      setMe(null);
      navigate("/login", { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ me, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

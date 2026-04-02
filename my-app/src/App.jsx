import { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function loadAuth() {
  const token = localStorage.getItem("smartiv_token");
  const role = localStorage.getItem("smartiv_role");
  if (!token) return { token: null, role: null };
  return { token, role };
}

export default function App() {
  const [auth, setAuth] = useState(loadAuth);

  useEffect(() => {
    // Keep state in sync if another tab logs in/out.
    const onStorage = () => setAuth(loadAuth());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const onLogout = () => {
    localStorage.removeItem("smartiv_token");
    localStorage.removeItem("smartiv_role");
    setAuth({ token: null, role: null });
  };

  return auth.token ? (
    <Dashboard token={auth.token} role={auth.role} onLogout={onLogout} />
  ) : (
    <Login
      onLoggedIn={(next) => {
        setAuth(next);
      }}
    />
  );
}

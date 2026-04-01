import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("smartiv_user") || "null");
  } catch {
    return null;
  }
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("smartiv_token"));
  const user = getStoredUser();

  function logout() {
    localStorage.removeItem("smartiv_token");
    localStorage.removeItem("smartiv_user");
    setToken(null);
  }

  if (!token) {
    return <Login onLoggedIn={() => setToken(localStorage.getItem("smartiv_token"))} />;
  }

  return (
    <div>
      <div style={{ padding: "10px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "system-ui" }}>
          Signed in as <b>{user?.email || "user"}</b> ({user?.role || "unknown"})
        </div>
        <button onClick={logout}>Logout</button>
      </div>
      <Dashboard />
    </div>
  );
}

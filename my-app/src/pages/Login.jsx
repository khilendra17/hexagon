import { useState } from "react";
import { api } from "../lib/api.js";

export default function Login({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const payload = res?.data || {};

      const token = payload.token || payload?.data?.token;
      const role = payload.role || payload?.data?.role;

      if (!token || (role !== "doctor" && role !== "patient")) {
        throw new Error("Login response missing token/role");
      }

      localStorage.setItem("smartiv_token", token);
      localStorage.setItem("smartiv_role", role);
      onLoggedIn({ token, role });
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Login failed. Check your credentials.";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ marginTop: 10, marginBottom: 6 }}>Smart IV Drip</h1>
      <div style={{ color: "var(--text)", opacity: 0.85, marginBottom: 18 }}>
        Sign in as doctor or patient
      </div>

      <form
        onSubmit={submit}
        style={{
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 16,
          textAlign: "left",
        }}
      >
        <label style={{ display: "block", marginBottom: 10 }}>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text-h)",
            }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 14 }}>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Password</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text-h)",
            }}
          />
        </label>

        {error ? (
          <div style={{ color: "#ef4444", marginBottom: 12, fontSize: 13 }}>{error}</div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "11px 12px",
            borderRadius: 10,
            border: "1px solid transparent",
            color: "var(--text-h)",
            background: "var(--accent-bg)",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}


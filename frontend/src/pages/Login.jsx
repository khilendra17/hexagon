import { useState } from "react";
import { api } from "../lib/api";

export default function Login({ onLoggedIn }) {
  const [email, setEmail] = useState("demo@smartiv.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const token = res.data?.data?.token;
      const user = res.data?.data?.user;
      if (!token || !user) throw new Error("Invalid login response");
      localStorage.setItem("smartiv_token", token);
      localStorage.setItem("smartiv_user", JSON.stringify(user));
      onLoggedIn();
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 420, margin: "64px auto", fontFamily: "system-ui" }}>
      <h2 style={{ marginBottom: 12 }}>Sign in</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
        {error && <div style={{ color: "crimson" }}>{error}</div>}
        <button disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
        Demo doctor: <code>demo@smartiv.com</code> / <code>demo123</code>
      </div>
    </div>
  );
}


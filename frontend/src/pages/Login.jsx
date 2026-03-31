import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('basic'); // 🔥 NEW
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('All fields required.'); return; }
    setLoading(true);
    try {
      // Try real API first; fall back to demo auth
      let token = null;
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (res.ok) {
          const d = await res.json();
          token = d.token;
        }
      } catch (_) { /* offline */ }

      // Demo fallback
      if (!token) {
        if (email === 'demo@smartiv.com' && password === 'demo123') {
          token = 'demo_jwt_token_' + Date.now();
        } else {
          throw new Error('Invalid credentials. Use demo@smartiv.com / demo123');
        }
      }

      // 🔥 SAVE TOKEN + PLAN
      localStorage.setItem('smartiv_token', token);
      localStorage.setItem('plan', plan);

      localStorage.setItem('smartiv_user', JSON.stringify({
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()),
        role: 'Physician',
        email,
        plan // optional extra
      }));

      nav('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-grid-bg" />

      {/* Ambient ECG line */}
      <div style={{ position: 'absolute', bottom: '15%', left: 0, right: 0, opacity: 0.15, pointerEvents: 'none' }}>
        <svg viewBox="0 0 1200 60" style={{ width: '100%', height: 60 }} preserveAspectRatio="none">
          <path d="M0,30 L80,30 L90,30 L95,5 L105,55 L115,8 L125,48 L135,30 L240,30 L250,30 L255,5 L265,55 L275,8 L285,48 L295,30 L400,30 L410,30 L415,5 L425,55 L435,8 L445,48 L455,30 L560,30 L570,30 L575,5 L585,55 L595,8 L605,48 L615,30 L720,30 L730,30 L735,5 L745,55 L755,8 L765,48 L775,30 L880,30 L890,30 L895,5 L905,55 L915,8 L925,48 L935,30 L1040,30 L1050,30 L1055,5 L1065,55 L1075,8 L1085,48 L1095,30 L1200,30" stroke="#00d4ff" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      <div className="login-panel">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">💉</div>
          <div className="login-logo-text">
            <div className="login-logo-title">SMART<span style={{ color: 'var(--accent-teal)' }}>IV</span></div>
            <div className="login-logo-sub">ICU MONITORING SYSTEM · v2.1</div>
          </div>
        </div>

        <div className="login-title">Physician Login</div>
        <div className="login-sub">Secure access to patient monitoring dashboard</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="login-email"
              className={`form-input ${error ? 'error' : ''}`}
              type="email"
              placeholder="doctor@hospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="login-password"
              className={`form-input ${error ? 'error' : ''}`}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          {/* 🔥 PLAN SELECTION */}
          <div className="form-group">
            <label className="form-label">Select Service Plan</label>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setPlan("basic")}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: plan === "basic" ? "2px solid #00d4ff" : "1px solid #444",
                  background: plan === "basic" ? "#0a1f2e" : "transparent",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                BASIC
              </button>

              <button
                type="button"
                onClick={() => setPlan("premium")}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: plan === "premium" ? "2px solid #00d4ff" : "1px solid #444",
                  background: plan === "premium" ? "#0a1f2e" : "transparent",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                PREMIUM
              </button>
            </div>

            <p style={{ fontSize: "12px", opacity: 0.7, marginTop: "5px" }}>
              Basic: Monitoring only · Premium: Alerts, logs & advanced insights
            </p>
          </div>

          <button id="login-submit" className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'AUTHENTICATING...' : 'SIGN IN →'}
          </button>
        </form>

        <div className="login-demo-hint">
          Demo: demo@smartiv.com / demo123
        </div>

        <div className="login-footer">
          HIPAA COMPLIANT · END-TO-END ENCRYPTED · AUDIT LOGGED
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const API = import.meta.env.VITE_API_URL || '';

export default function Register() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [patientSlug, setPatientSlug] = useState('rahul-sharma');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Name, email, and password are required.');
      return;
    }
    if (role === 'family' && !patientSlug.trim()) {
      setError('Enter the patient link code from the care team.');
      return;
    }
    setLoading(true);
    try {
      const body = { name, email, password, role, patientSlug: role === 'family' ? patientSlug.trim() : undefined };
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      login(data.token, data.user);
      if (data.user.role === 'family') {
        nav(`/patient/${data.user.patientSlug}`, { replace: true });
      } else {
        nav('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-grid-bg" />
      <div className="login-panel" style={{ maxWidth: 440 }}>
        <div className="login-title">Create account</div>
        <div className="login-sub">Choose clinical staff or family access</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className={`form-input ${error ? 'error' : ''}`} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className={`form-input ${error ? 'error' : ''}`} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className={`form-input ${error ? 'error' : ''}`} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Account type</label>
            <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="staff">Clinical staff (dashboard)</option>
              <option value="family">Family (patient view)</option>
            </select>
          </div>

          {role === 'family' && (
            <div className="form-group">
              <label className="form-label">Patient link code</label>
              <input
                className="form-input"
                value={patientSlug}
                onChange={(e) => setPatientSlug(e.target.value)}
                placeholder="e.g. rahul-sharma"
              />
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                Issued by the ward for your loved one&apos;s bedside page.
              </div>
            </div>
          )}

          {error && <div className="form-error">{error}</div>}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Sign up'}
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: 13 }}>
          <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}

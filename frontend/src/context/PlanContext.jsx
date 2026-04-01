/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

function resolveApiBase() {
  const fromEnv = import.meta.env.VITE_API_URL;
  if (fromEnv) return fromEnv;

  // Local fallback so direct local runs don't accidentally hit frontend HTML routes.
  if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return 'http://localhost:5000';
  }
  return '';
}

const API_BASE = resolveApiBase();
const SESSION_KEY = 'vitaflow_patient_session';

const PlanContext = createContext(null);

export function PlanProvider({ children }) {
  function readSavedSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.plan && saved?.patientInfo) {
          return saved;
        }
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
    return null;
  }

  const restored = readSavedSession();
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(restored));
  const [plan, setPlan] = useState(restored?.plan ?? null);
  const [patientInfo, setPatientInfo] = useState(restored?.patientInfo ?? null);

  async function login(accessCode) {
    const code = accessCode.trim().toUpperCase().slice(0, 6);
    let res;
    try {
      res = await fetch(`${API_BASE}/api/patient-access/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: code }),
      });
    } catch {
      throw new Error('Cannot reach server. Check that the backend is running and VITE_API_URL is set correctly.');
    }
    const contentType = res.headers.get('content-type') || '';
    let json;

    if (contentType.includes('application/json')) {
      json = await res.json();
    } else {
      const raw = await res.text();
      if (raw.trim().startsWith('<!DOCTYPE') || raw.trim().startsWith('<html')) {
        throw new Error('Server returned HTML instead of API JSON. Check VITE_API_URL and backend route /api/patient-access/verify.');
      }
      throw new Error('Server returned an unexpected response format.');
    }

    if (!res.ok) {
      throw new Error(json?.error || `Request failed (${res.status}).`);
    }
    if (!json.success) throw new Error(json.error || 'Invalid or expired access code.');

    const { plan: p, patientId, patientName, bedNumber, accessCode: ac } = json.data;
    const info = { patientId, patientName, bedNumber, accessCode: ac };

    setPlan(p);
    setPatientInfo(info);
    setIsAuthenticated(true);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ plan: p, patientInfo: info }));
    return json.data;
  }

  function logout() {
    setPlan(null);
    setPatientInfo(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
  }

  return (
    <PlanContext.Provider value={{ isAuthenticated, plan, patientInfo, login, logout }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlanContext() {
  return useContext(PlanContext);
}

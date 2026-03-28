import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartiv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('smartiv_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────
export const login = (email, password) =>
  api.post('/api/auth/login', { email, password });

// ── Patients ─────────────────────────────────────────────────
export const getPatients = () => api.get('/api/patients');
export const getPatientLatest = (id) => api.get(`/api/patient/${id}/latest`);
export const getPatientHistory = (id, from, to) =>
  api.get(`/api/patient/${id}/history`, { params: { from, to } });
export const getDrugImpact = (id) => api.get(`/api/patient/${id}/drug-impact`);

// ── Alerts ───────────────────────────────────────────────────
export const getActiveAlerts = () => api.get('/api/alerts?status=active');
export const acknowledgeAlert = (id) => api.post(`/api/alerts/${id}/ack`);

// ── Control ──────────────────────────────────────────────────
export const controlValve = (patientId, state) =>
  api.post('/api/control/valve', { patientId, state });
export const controlFlow = (patientId, rate) =>
  api.post('/api/control/flow', { patientId, rate });

// ── Logs ─────────────────────────────────────────────────────
export const getLogs = (params) => api.get('/api/logs', { params });

// ── Settings ─────────────────────────────────────────────────
export const updateSettings = (patientId, data) =>
  api.put(`/api/settings/${patientId}`, data);

export default api;

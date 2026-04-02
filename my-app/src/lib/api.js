import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL || !String(baseURL).trim()) {
  // Fail fast so misconfiguration is obvious.
  throw new Error("Missing required env var: VITE_API_URL");
}

export const api = axios.create({
  baseURL,
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("smartiv_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


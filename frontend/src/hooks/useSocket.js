import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../services/api.js";

export function useSocket() {
  const baseURL = import.meta.env.VITE_API_URL;
  const [vitals, setVitals] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    let socket;

    async function loadInitial() {
      try {
        const [vh, ar] = await Promise.all([
          api.get("/api/vitals/history", { params: { limit: 100 } }),
          api.get("/api/alerts"),
        ]);
        if (cancelled) return;
        const v = vh.data?.data ?? [];
        setVitals([...v].reverse());
        setAlerts(ar.data?.data ?? []);
      } catch (e) {
        console.error(e);
      }
    }

    loadInitial();

    if (baseURL) {
      socket = io(baseURL, { transports: ["websocket", "polling"] });
      socket.on("vitals:new", (doc) => {
        setVitals((prev) => [...prev, doc].slice(-100));
      });
      socket.on("alert:new", (doc) => {
        setAlerts((prev) => [doc, ...prev].slice(0, 100));
      });
    }

    return () => {
      cancelled = true;
      socket?.disconnect();
    };
  }, [baseURL]);

  return { vitals, alerts };
}

import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../lib/api.js";
import { createAuthedSocket } from "../lib/socket.js";

function toMs(ts) {
  const d = ts instanceof Date ? ts : new Date(ts);
  const t = d.getTime();
  return Number.isFinite(t) ? t : null;
}

export function useLiveFeed({ token }) {
  const [vitals, setVitals] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [insight, setInsight] = useState(null);
  const [visionStatus, setVisionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);

  const limit = useMemo(() => 100, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      setLoading(true);
      try {
        const [vitalsRes, alertsRes, insightsRes] = await Promise.all([
          api.get("/api/vitals/history", { params: { limit } }),
          api.get("/api/alerts"),
          api.get("/api/insights"),
        ]);

        if (cancelled) return;

        const vitalsList = vitalsRes?.data?.data || vitalsRes?.data || [];
        const alertsList = alertsRes?.data?.data || alertsRes?.data || [];
        const insightObj = insightsRes?.data?.data || insightsRes?.data || null;

        // Backend returns newest first; charts prefer oldest→newest.
        setVitals(
          vitalsList
            .slice()
            .sort((a, b) => (toMs(a.timestamp) ?? 0) - (toMs(b.timestamp) ?? 0))
        );
        setAlerts(alertsList);
        setInsight(insightObj);
      } catch (err) {
        if (!cancelled) {
          console.error("Initial feed load failed:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInitial();

    // Socket live updates
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    if (!token) return;

    const socket = createAuthedSocket(token);
    socketRef.current = socket;

    socket.on("vitals:new", (payload) => {
      setVitals((prev) => {
        const next = prev.some((v) => v._id && payload?._id && v._id === payload._id)
          ? prev
          : [...prev, payload];
        next.sort((a, b) => (toMs(a.timestamp) ?? 0) - (toMs(b.timestamp) ?? 0));
        return next.slice(-limit);
      });
    });

    socket.on("alert:new", (payload) => {
      setAlerts((prev) => {
        const next = [...prev];
        if (!next.some((a) => a._id && payload?._id && a._id === payload._id)) {
          next.unshift(payload);
        }
        return next;
      });
    });

    socket.on("insight:update", (payload) => {
      setInsight(payload || null);
    });

    socket.on("vision:update", (payload) => {
      const status = payload?.status;
      setVisionStatus(status ?? null);
    });

    socket.connect();

    return () => {
      cancelled = true;
      if (socketRef.current) {
        socketRef.current.off("vitals:new");
        socketRef.current.off("alert:new");
        socketRef.current.off("insight:update");
        socketRef.current.off("vision:update");
        socketRef.current.disconnect();
      }
      socketRef.current = null;
    };
  }, [token, limit]);

  return { vitals, alerts, insight, visionStatus, loading };
}


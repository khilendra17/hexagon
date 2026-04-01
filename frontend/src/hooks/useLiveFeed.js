import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { socket } from "../lib/socket";

export function useLiveFeed() {
  const [vitals, setVitals] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [insight, setInsight] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem("smartiv_token") || "";
    if (!token) return;

    socket.auth = { token };
    socket.connect();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onVitals = (p) => setVitals((prev) => [p, ...prev].slice(0, 200));
    const onAlert = (a) => setAlerts((prev) => [a, ...prev].slice(0, 200));
    const onInsight = (r) => setInsight(r);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("vitals:new", onVitals);
    socket.on("alert:new", onAlert);
    socket.on("insight:update", onInsight);

    (async () => {
      try {
        const [vh, al, ins] = await Promise.all([
          api.get("/api/vitals/history?limit=50"),
          api.get("/api/alerts"),
          api.get("/api/insights"),
        ]);
        if (cancelled) return;
        setVitals(vh.data?.data || []);
        setAlerts(al.data?.data || []);
        setInsight(ins.data?.data || null);
      } catch {
        // ignore; auth or backend might not be running
      }
    })();

    return () => {
      cancelled = true;
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("vitals:new", onVitals);
      socket.off("alert:new", onAlert);
      socket.off("insight:update", onInsight);
      socket.disconnect();
    };
  }, []);

  return { vitals, alerts, insight, connected };
}


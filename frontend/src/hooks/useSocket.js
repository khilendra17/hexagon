import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { getInsights } from '../api';

export function useDrugCurveInsight() {
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getInsights()
      .then((res) => {
        const d = res.data?.data ?? res.data;
        if (!cancelled && d) setPayload(d);
      })
      .catch(() => {});

    socket.connect();
    const onInsight = (data) => setPayload(data);
    socket.on('insight:update', onInsight);
    return () => {
      cancelled = true;
      socket.off('insight:update', onInsight);
    };
  }, []);

  return [payload, setPayload];
}

export function useVitals(patientId, onData) {
  useEffect(() => {
    if (!patientId) return;
    const handler = (data) => onData(data);
    socket.on(`vitals:${patientId}`, handler);
    return () => socket.off(`vitals:${patientId}`, handler);
  }, [patientId, onData]);
}

export function useAlerts(onAlert) {
  useEffect(() => {
    const handler = (data) => onAlert(data);
    socket.on('alert', handler);
    return () => socket.off('alert', handler);
  }, [onAlert]);
}

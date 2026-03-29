import { useState, useEffect, useCallback } from 'react';
import { socket } from '../socket.js';
import { getVitals } from '../api/index.js';

/**
 * useVitals(patientId, maxPoints)
 * Fetches last maxPoints readings on mount, then appends live socket updates.
 * Returns { vitals, latest, loading }
 */
export function useVitals(patientId, maxPoints = 30) {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial history
  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    getVitals(patientId, maxPoints)
      .then((res) => {
        const list = (res?.data || res || []).slice().reverse(); // oldest→newest
        setVitals(list);
      })
      .catch(() => {}) // ignore — socket will populate
      .finally(() => setLoading(false));
  }, [patientId, maxPoints]);

  // Subscribe to live updates
  useEffect(() => {
    if (!patientId) return;
    const handler = (data) => {
      if ((data.patientId?.toString?.() || data.patientId) !== patientId?.toString()) return;
      setVitals((prev) => {
        const next = [...prev, data];
        return next.length > maxPoints ? next.slice(-maxPoints) : next;
      });
    };
    socket.on('vitals_update', handler);
    socket.on('vitals:new', handler);
    return () => {
      socket.off('vitals_update', handler);
      socket.off('vitals:new', handler);
    };
  }, [patientId, maxPoints]);

  const latest = vitals[vitals.length - 1] || null;
  return { vitals, latest, loading };
}

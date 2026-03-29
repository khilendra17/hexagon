import { useState, useEffect, useCallback } from 'react';
import { socket } from '../socket';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * useBottleSessions(patientId)
 * Fetches today's sessions on mount, subscribes to session:update.
 */
export function useBottleSessions(patientId) {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchToday = useCallback(() => {
    if (!patientId) return;
    setIsLoading(true);
    fetch(`${API}/api/sessions/${patientId}/today`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.data) setSessions(json.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [patientId]);

  useEffect(() => {
    fetchToday();

    const onUpdate = ({ sessionId, vitalsTimeline }) => {
      setSessions((prev) =>
        prev.map((s) => {
          const id = s._id?.toString?.() || s._id;
          if (id !== sessionId) return s;
          return { ...s, vitalsTimeline: [...(s.vitalsTimeline || []), vitalsTimeline] };
        })
      );
    };

    socket.on('session:update', onUpdate);
    return () => socket.off('session:update', onUpdate);
  }, [fetchToday]);

  return { sessions, todaySessions: sessions, isLoading, refetch: fetchToday };
}

export default useBottleSessions;

import { useState, useEffect } from 'react';
import { socket } from '../socket';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Derive a plain-English { message, level } from the raw insight object.
 */
function deriveInsight(raw) {
  if (!raw) return null;

  // If the backend already provides a friendly shape, use it directly
  if (raw.message) return raw;

  // Derive from the drug curve service shape
  const text = raw.insight || '';
  const improvement = raw.improvement;

  // Determine level from improvement data or text content
  let level = 'normal';
  if (text.toLowerCase().includes('no measurable')) {
    level = 'warning';
  } else if (improvement?.spo2 != null && improvement.spo2 < -1) {
    level = 'critical';
  } else if (improvement?.spo2 != null && improvement.spo2 >= 1) {
    level = 'normal';
  }

  // Translate clinical text to family-friendly language
  let message = text;
  if (text.includes('responded within') && raw.stabilisationMins != null) {
    message = `Good news — Rahul's body responded to the IV within ${Math.round(raw.responseDelayMins)} mins and stabilised shortly after.`;
  } else if (text.includes('no measurable')) {
    message = "The doctor is monitoring how Rahul's body responds to the current treatment.";
    level = 'warning';
  }

  return { message, level };
}

/**
 * useInsights(patientId?)
 * Fetches latest insight on mount, then subscribes to insight:update socket.
 * Returns { insight: { message, level } | null, isLoading }
 */
export function useInsights(patientId) {
  const [insight, setInsight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // patientId is informational for future per-patient endpoints
    fetch(`${API}/api/insights`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.data) setInsight(deriveInsight(json.data));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));

    const onUpdate = (data) => setInsight(deriveInsight(data));
    socket.on('insight:update', onUpdate);
    return () => socket.off('insight:update', onUpdate);
  }, [patientId]);

  return { insight, isLoading };
}

export default useInsights;

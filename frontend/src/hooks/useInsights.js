import { useState, useEffect } from 'react';
import { socket } from '../socket';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Derive a plain-English { message, level } from the raw insight object.
 */
function deriveInsight(raw, patientName) {
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

  const who = patientName ? `${patientName.split(' ')[0]}` : 'The patient';

  // Translate clinical text to family-friendly language
  let message = text;
  if (text.includes('responded within') && raw.stabilisationMins != null) {
    message = `Good news — ${who}'s body responded to the IV within ${Math.round(raw.responseDelayMins)} mins and stabilised shortly after.`;
  } else if (text.includes('no measurable')) {
    message = `The care team is monitoring how ${who}'s body responds to the current treatment.`;
    level = 'warning';
  }

  return { message, level };
}

/**
 * useInsights(patientId?, patientName?)
 * Fetches latest insight on mount, then subscribes to insight:update socket.
 * Returns { insight, rawInsight, isLoading }
 */
export function useInsights(patientId, patientName) {
  const [insight, setInsight] = useState(null);
  const [rawInsight, setRawInsight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/insights`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.data) {
          setRawInsight(json.data);
          setInsight(deriveInsight(json.data, patientName));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));

    const onUpdate = (data) => {
      setRawInsight(data);
      setInsight(deriveInsight(data, patientName));
    };
    socket.on('insight:update', onUpdate);
    return () => socket.off('insight:update', onUpdate);
  }, [patientId, patientName]);

  return { insight, rawInsight, isLoading };
}

export default useInsights;

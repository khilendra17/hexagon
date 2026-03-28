import { useEffect } from 'react';
import { socket } from '../socket';

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

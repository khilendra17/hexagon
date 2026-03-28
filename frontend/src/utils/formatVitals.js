// ── Vitals formatting ─────────────────────────────────────────
export const fmtHR = (v) => (v != null ? `${Math.round(v)}` : '--');
export const fmtSpO2 = (v) => (v != null ? `${Number(v).toFixed(1)}` : '--');
export const fmtFlow = (v) => (v != null ? `${Number(v).toFixed(1)}` : '--');

export const statusColor = (status) => {
  switch ((status || '').toUpperCase()) {
    case 'STABLE':     return 'status-stable';
    case 'ALERT':      return 'status-alert';
    case 'CRITICAL':   return 'status-critical';
    case 'MONITORING': return 'status-monitoring';
    default:           return 'status-stable';
  }
};

export const severityColor = (type) => {
  switch ((type || '').toUpperCase()) {
    case 'SPO2_LOW':    return 'var(--accent-red)';
    case 'HR_ABNORMAL': return 'var(--accent-yellow)';
    case 'IV_STOPPED':  return '#ff7c00';
    case 'BACKFLOW':    return 'var(--accent-red)';
    default:            return 'var(--accent-teal)';
  }
};

export const severityLabel = (type) => {
  switch ((type || '').toUpperCase()) {
    case 'SPO2_LOW':    return '🩸 SpO₂ LOW';
    case 'HR_ABNORMAL': return '💓 HR ABNORMAL';
    case 'IV_STOPPED':  return '⛔ IV STOPPED';
    case 'BACKFLOW':    return '🔴 BACKFLOW';
    default:            return '⚠ ALERT';
  }
};

export const relativeTime = (ts) => {
  if (!ts) return '--';
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return new Date(ts).toLocaleTimeString();
};

export const MOCK_PATIENTS = [
  {
    patientId: 'P-0047', name: 'Ananya Sharma', room: 'ICU-3',
    status: 'STABLE', hr: 72, spo2: 97, ivFlow: 42, valve: 'OPEN', backflow: false,
    doctor: 'Dr. Mehta', drug: 'Dopamine 5mcg/kg/min',
  },
  {
    patientId: 'P-0048', name: 'Rajiv Gupta', room: 'ICU-4',
    status: 'ALERT', hr: 108, spo2: 91, ivFlow: 18, valve: 'CLOSED', backflow: false,
    doctor: 'Dr. Singh', drug: 'Saline 0.9%',
  },
  {
    patientId: 'P-0049', name: 'Priya Nair', room: 'ICU-5',
    status: 'MONITORING', hr: 88, spo2: 95, ivFlow: 65, valve: 'OPEN', backflow: false,
    doctor: 'Dr. Mehta', drug: 'Furosemide 40mg',
  },
  {
    patientId: 'P-0050', name: 'Arjun Patel', room: 'ICU-6',
    status: 'STABLE', hr: 64, spo2: 99, ivFlow: 30, valve: 'OPEN', backflow: false,
    doctor: 'Dr. Rao', drug: 'Norepinephrine 8mcg/min',
  },
  {
    patientId: 'P-0051', name: 'Kavya Reddy', room: 'ICU-7',
    status: 'CRITICAL', hr: 135, spo2: 87, ivFlow: 0, valve: 'CLOSED', backflow: true,
    doctor: 'Dr. Singh', drug: 'Epinephrine 10mcg/min',
  },
  {
    patientId: 'P-0052', name: 'Suresh Kumar', room: 'ICU-8',
    status: 'STABLE', hr: 76, spo2: 96, ivFlow: 55, valve: 'OPEN', backflow: false,
    doctor: 'Dr. Rao', drug: 'Dobutamine 5mcg/kg/min',
  },
];

export const MOCK_ALERTS = [
  { id: 'a1', type: 'SPO2_LOW', patientId: 'P-0051', room: 'ICU-7', message: 'SpO₂ dropped to 87% — below critical threshold', ts: new Date(Date.now() - 60000).toISOString(), acked: false },
  { id: 'a2', type: 'BACKFLOW', patientId: 'P-0051', room: 'ICU-7', message: 'Blood backflow detected — solenoid CLOSED', ts: new Date(Date.now() - 90000).toISOString(), acked: false },
  { id: 'a3', type: 'HR_ABNORMAL', patientId: 'P-0048', room: 'ICU-4', message: 'Heart rate elevated: 108 BPM (threshold: 100)', ts: new Date(Date.now() - 180000).toISOString(), acked: false },
  { id: 'a4', type: 'IV_STOPPED', patientId: 'P-0051', room: 'ICU-7', message: 'IV flow rate = 0 mL/hr — infusion stopped', ts: new Date(Date.now() - 300000).toISOString(), acked: true },
  { id: 'a5', type: 'SPO2_LOW', patientId: 'P-0048', room: 'ICU-4', message: 'SpO₂ at 91% — below warning threshold', ts: new Date(Date.now() - 600000).toISOString(), acked: true },
];

export function generateHistory(length = 60, baseHR = 75, baseSpo2 = 96) {
  return Array.from({ length }, (_, i) => ({
    t: i,
    hr: baseHR + Math.sin(i * 0.3) * 8 + (Math.random() - 0.5) * 4,
    spo2: Math.min(100, baseSpo2 + Math.sin(i * 0.15) * 2 + (Math.random() - 0.5) * 0.8),
    ivFlow: 40 + Math.sin(i * 0.1) * 5 + (Math.random() - 0.5) * 2,
  }));
}

export function generateDrugImpact() {
  return Array.from({ length: 31 }, (_, i) => ({
    t: i,
    spo2Delta: i < 5 ? 0 : Math.min(4, (i - 5) * 0.5 + (Math.random() - 0.5) * 0.3),
    hrDelta: i < 5 ? 0 : Math.min(18, (i - 5) * 1.8 + (Math.random() - 0.5) * 1),
    infusion: i === 5 ? 1 : 0,
  }));
}

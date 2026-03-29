/**
 * PRD §12.4 — IV vision status (camera / AI).
 */
const LABELS = {
  normal: { label: 'Normal', tone: 'good' },
  backflow: { label: 'Backflow detected', tone: 'bad' },
  empty: { label: 'Bottle empty', tone: 'bad' },
  air_detected: { label: 'Air in line', tone: 'bad' },
  error: { label: 'Vision service unavailable', tone: 'warn' },
};

export default function PatientIVVisionBar({ visionStatus }) {
  const key = visionStatus || 'error';
  const meta = LABELS[key] || LABELS.error;

  return (
    <div className={`patient-iv-vision patient-iv-vision-${meta.tone}`}>
      <div className="patient-iv-vision-label">IV line (camera)</div>
      <div className="patient-iv-vision-value">{meta.label}</div>
    </div>
  );
}

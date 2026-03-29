/**
 * PRD §12.2 — Alert panel (family-friendly summary).
 */
function severityClass(sev) {
  if (sev === 'critical') return 'patient-alert patient-alert-critical';
  if (sev === 'warning') return 'patient-alert patient-alert-warning';
  return 'patient-alert patient-alert-info';
}

function formatTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
}

export default function PatientAlertsStrip({ alerts, max = 12 }) {
  const list = (alerts || []).slice(0, max);

  if (!list.length) {
    return (
      <div className="patient-prd-card">
        <div className="patient-section-title">Clinical alerts</div>
        <p className="patient-muted-text">No active alerts at this time.</p>
      </div>
    );
  }

  return (
    <div className="patient-prd-card patient-alerts-card">
      <div className="patient-section-title">Clinical alerts</div>
      <div className="patient-alert-list">
        {list.map((a) => (
          <div key={a._id || a.message} className={severityClass(a.severity)}>
            <span className="patient-alert-severity" aria-hidden>
              {(a.severity || 'info').toUpperCase()}
            </span>
            <div className="patient-alert-body">
              <div className="patient-alert-msg">{a.message}</div>
              <div className="patient-alert-time">{formatTime(a.timestamp)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

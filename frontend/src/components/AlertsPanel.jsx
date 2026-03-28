import { MOCK_ALERTS } from '../utils/formatVitals';
import { severityColor, severityLabel, relativeTime } from '../utils/formatVitals';
import { useState } from 'react';

export default function AlertsPanel({ compact = false, onAck }) {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  function handleAck(id) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acked: true } : a)));
    onAck?.(id);
  }

  const active = alerts.filter((a) => !a.acked);
  const acked = compact ? [] : alerts.filter((a) => a.acked);
  const display = compact ? active.slice(0, 5) : [...active, ...acked];

  if (!display.length) {
    return (
      <div className="alerts-empty">
        ✓ No active alerts
      </div>
    );
  }

  return (
    <div className="alerts-panel">
      {!compact && active.length > 0 && (
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>
          UNACKNOWLEDGED ({active.length})
        </div>
      )}
      {display.map((a) => {
        const color = severityColor(a.type);
        const label = severityLabel(a.type);
        return (
          <div
            key={a.id}
            className={`alert-row ${a.acked ? 'acked' : 'unacked'}`}
            style={{ borderLeftColor: color }}
          >
            <div className="alert-severity-icon">
              {a.type === 'SPO2_LOW' ? '🩸' : a.type === 'HR_ABNORMAL' ? '💓' : a.type === 'BACKFLOW' ? '🔴' : '⛔'}
            </div>
            <div className="alert-content">
              <div className="alert-type" style={{ color }}>
                {label}
              </div>
              <div className="alert-message">{a.message}</div>
              <div className="alert-meta">
                <span className="alert-meta-item">
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--accent-teal)' }}>{a.patientId}</span>
                </span>
                <span className="alert-meta-item">· {a.room}</span>
                <span className="alert-meta-item">· {relativeTime(a.ts)}</span>
                {a.acked && <span style={{ color: 'var(--accent-green)' }}>· ACKNOWLEDGED</span>}
              </div>
            </div>
            {!a.acked && (
              <button className="ack-btn" onClick={() => handleAck(a.id)}>ACK</button>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import PatientCard from '../components/PatientCard';
import AlertsPanel from '../components/AlertsPanel';
import { MOCK_PATIENTS, MOCK_ALERTS } from '../utils/formatVitals';

export default function Dashboard() {
  const [patients, setPatients] = useState(MOCK_PATIENTS);

  // 🔥 PLAN DETECTION
  const plan = localStorage.getItem('plan') || 'basic';

  const unacked = MOCK_ALERTS.filter((a) => !a.acked).length;

  // Simulate live data
  useEffect(() => {
    const tick = setInterval(() => {
      setPatients((prev) =>
        prev.map((p) => ({
          ...p,
          hr: Math.max(40, Math.min(160, p.hr + (Math.random() - 0.5) * 3)),
          spo2: Math.max(80, Math.min(100, p.spo2 + (Math.random() - 0.5) * 0.8)),
          ivFlow: Math.max(0, p.ivFlow + (Math.random() - 0.5) * 1.5),
        }))
      );
    }, 2000);
    return () => clearInterval(tick);
  }, []);

  const alertsBySeverity = ['CRITICAL', 'ALERT', 'MONITORING', 'STABLE'];
  const sorted = [...patients].sort((a, b) =>
    alertsBySeverity.indexOf(a.status) - alertsBySeverity.indexOf(b.status)
  );

  const stats = {
    total: patients.length,
    critical: patients.filter((p) => p.status === 'CRITICAL').length,
    alert: patients.filter((p) => p.status === 'ALERT').length,
    stable: patients.filter((p) => p.status === 'STABLE').length,
    monitoring: patients.filter((p) => p.status === 'MONITORING').length,
  };

  return (
    <div className="app-shell">
      <Sidebar alertCount={unacked} />
      <div className="main-content">
        <TopBar title="ICU DASHBOARD — WARD 3" />

        <div className="page-body">

          {/* PLAN INDICATOR */}
          <div style={{ marginBottom: 12, fontSize: 12, color: 'var(--text-muted)' }}>
            Current Plan: <strong style={{ color: '#00d4ff' }}>{plan.toUpperCase()}</strong>
          </div>

          {/* Stats strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'TOTAL PATIENTS', val: stats.total, color: 'var(--accent-teal)' },
              { label: 'CRITICAL', val: stats.critical, color: 'var(--accent-red)' },
              { label: 'ALERT', val: stats.alert, color: '#ff7c00' },
              { label: 'MONITORING', val: stats.monitoring, color: 'var(--accent-yellow)' },
              { label: 'STABLE', val: stats.stable, color: 'var(--accent-green)' },
            ].map((s) => (
              <div key={s.label} className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 700, color: s.color }}>
                  {s.val}
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 6 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Page header */}
          <div className="page-header">
            <div>
              <div className="page-heading">ACTIVE PATIENTS</div>
              <div className="page-subhead">{patients.length} patients · Real-time monitoring active</div>
            </div>
            <div className="live-indicator">
              <span className="live-dot" />
              LIVE DATA
            </div>
          </div>

          {/* Patient grid */}
          <div className="dashboard-grid" style={{ marginBottom: 28 }}>
            {sorted.map((p) => (
              <PatientCard key={p.patientId} patient={p} />
            ))}
          </div>

          {/* PREMIUM FEATURE: ALERTS */}
          {plan === 'premium' ? (
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
                ACTIVE ALERTS ({unacked})
              </div>
              <AlertsPanel compact />
            </div>
          ) : (
            <div className="card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 14, marginBottom: 8 }}>
                🔒 Alerts & Advanced Monitoring Locked
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Upgrade to Premium to access alerts, logs, and AI insights
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
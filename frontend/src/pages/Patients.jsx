import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import PatientCard from '../components/PatientCard';
import { MOCK_PATIENTS } from '../utils/formatVitals';

export default function Patients() {

  // PLAN DETECTION
  const plan = localStorage.getItem('plan') || 'basic';

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar title="ALL PATIENTS" />

        <div className="page-body">

          {/* 🔥 PLAN INDICATOR */}
          <div style={{ marginBottom: 10, fontSize: 12, color: 'var(--text-muted)' }}>
            Current Plan: <strong style={{ color: '#00d4ff' }}>{plan.toUpperCase()}</strong>
          </div>

          <div className="page-header">
            <div>
              <div className="page-heading">PATIENT ROSTER</div>
              <div className="page-subhead">
                {MOCK_PATIENTS.length} patients · ICU Ward 3
              </div>
            </div>

            <div className="live-indicator">
              <span className="live-dot" />
              LIVE
            </div>
          </div>

          {/* OPTIONAL PREMIUM HINT */}
          {plan === "basic" && (
            <div className="card" style={{ padding: 12, marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 13 }}>
                🔒 Upgrade to Premium to unlock detailed patient analytics & AI insights
              </div>
            </div>
          )}

          <div className="dashboard-grid">
            {MOCK_PATIENTS.map((p) => (
              <PatientCard key={p.patientId} patient={p} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
/**
 * PatientHome.jsx
 * /patient/:patientId — Mobile-first patient/family home view.
 */
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useVitals } from '../../hooks/useVitals';
import { useBottleSessions } from '../../hooks/useBottleSessions';
import StatusIndicator from '../../components/patient/StatusIndicator';
import BottleCard from '../../components/patient/BottleCard';
import InsightBanner from '../../components/patient/InsightBanner';
import { getOverallStatus } from '../../utils/insightGenerator';

const STATUS_PILL = {
  normal: 'status-pill-large normal',
  warning: 'status-pill-large warning',
  critical: 'status-pill-large critical',
};

function LastUpdated({ latest }) {
  const [mins, setMins] = useState(0);
  useEffect(() => {
    const ts = latest?.timestamp;
    if (!ts) return;
    const interval = setInterval(() => {
      setMins(Math.floor((Date.now() - new Date(ts).getTime()) / 60000));
    }, 30000);
    setMins(Math.floor((Date.now() - new Date(ts).getTime()) / 60000));
    return () => clearInterval(interval);
  }, [latest]);
  if (!latest) return null;
  return <div className="last-updated">Last updated {mins === 0 ? 'just now' : `${mins} min ago`}</div>;
}

// Pad to always show 3 bottle slots
function padSessions(sessions) {
  const result = [...sessions];
  while (result.length < 3) {
    result.push({ _placeholder: true, bottleNumber: result.length + 1, status: 'upcoming' });
  }
  return result.slice(0, 3);
}

export default function PatientHome() {
  const { patientId = 'rahul-sharma' } = useParams();
  const { latest } = useVitals(patientId);
  const { sessions } = useBottleSessions(patientId);
  const overall = getOverallStatus(latest);
  const paddedSessions = padSessions(sessions);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="patient-page">
      {/* Header */}
      <div className="patient-header">
        <div className="patient-name-large">Rahul Sharma</div>
        <div className="patient-info-sub">Bed 4A · Ward 3B · Admitted 3 days ago</div>
        <div className={STATUS_PILL[overall.level]}>{overall.label}</div>
        <LastUpdated latest={latest} />
      </div>

      <InsightBanner patientId={patientId} />

      {/* Current Status */}
      <div className="patient-section">
        <div className="patient-section-title">Current Status</div>
        <StatusIndicator
          latest={latest}
          ivStatus={latest?.ivStatus || 'running'}
          ivRemaining={latest?.ivRemaining ?? 500}
        />
      </div>

      {/* Today's Treatment */}
      <div className="patient-section">
        <div className="patient-section-title">Today's Treatment — {today}</div>
        <div className="bottle-card-list">
          {paddedSessions.map((s, i) =>
            s._placeholder ? (
              <div key={i} className="bottle-card upcoming">
                <div className="bottle-circle upcoming"><span>{s.bottleNumber}</span></div>
                <div className="bottle-card-body">
                  <div className="bottle-card-title">Bottle {s.bottleNumber} of 3</div>
                  <div className="bottle-card-upcoming">Not yet started</div>
                </div>
              </div>
            ) : (
              <BottleCard key={s._id || i} session={s} patientId={patientId} />
            )
          )}
        </div>
        <Link to={`/patient/${patientId}/today`} className="btn-text patient-view-all">
          View Detailed Sessions →
        </Link>
      </div>

      {/* Quick navigation */}
      <div className="patient-quick-nav">
        <Link to={`/patient/${patientId}/history`} className="patient-nav-card">
          <span className="patient-nav-icon">📋</span>
          <span>History</span>
        </Link>
        <Link to={`/patient/${patientId}/export`} className="patient-nav-card">
          <span className="patient-nav-icon">📤</span>
          <span>Export &amp; Share</span>
        </Link>
      </div>
    </div>
  );
}

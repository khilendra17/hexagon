/**
 * TodaySessions.jsx
 * /patient/:patientId/today  — Full-page detailed today's bottles.
 */
import { Link, useParams } from 'react-router-dom';
import { useBottleSessions } from '../../hooks/useBottleSessions';
import BottleCard from '../../components/patient/BottleCard';

function padSessions(sessions) {
  const result = [...sessions];
  while (result.length < 3) {
    result.push({ _placeholder: true, bottleNumber: result.length + 1, status: 'upcoming' });
  }
  return result.slice(0, 3);
}

export default function TodaySessions() {
  const { patientId = 'rahul-sharma' } = useParams();
  const { sessions, isLoading } = useBottleSessions(patientId);
  const paddedSessions = padSessions(sessions);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="patient-page">
      <div className="patient-page-back">
        <Link to={`/patient/${patientId}`} className="btn-text">← Back</Link>
      </div>
      <div className="patient-header">
        <div className="patient-name-large" style={{ fontSize: 22 }}>Today's Treatment</div>
        <div className="patient-info-sub">{today}</div>
      </div>

      {isLoading ? (
        <div className="patient-loading">Loading sessions...</div>
      ) : (
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
      )}

      <div className="patient-section">
        <Link to={`/patient/${patientId}/history`} className="btn btn-ghost" style={{ marginRight: 12 }}>
          View Full History
        </Link>
        <Link to={`/patient/${patientId}/export`} className="btn btn-ghost">
          Export & Share
        </Link>
      </div>
    </div>
  );
}

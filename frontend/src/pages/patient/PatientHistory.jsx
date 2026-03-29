/**
 * PatientHistory.jsx
 * /patient/:patientId/history — Grouped by date, descending.
 */
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function fmtTime(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function EfficacyPill({ score }) {
  if (score == null) return null;
  const cls = score >= 70 ? 'pill-green' : score >= 40 ? 'pill-amber' : 'pill-red';
  return <span className={`efficacy-pill ${cls}`}>{score}%</span>;
}

function groupByDate(sessions) {
  const groups = {};
  sessions.forEach((s) => {
    const dateKey = new Date(s.startTime || s.date).toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(s);
  });
  // Sort descending
  return Object.entries(groups).sort(([a], [b]) => new Date(b) - new Date(a));
}

function formatGroupDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function PatientHistory() {
  const { patientId = 'rahul-sharma' } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/sessions/${patientId}`)
      .then((r) => r.json())
      .then((json) => { if (json?.data) setSessions(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [patientId]);

  const groups = groupByDate(sessions);
  const totalBottles = sessions.length;
  const medsGiven = sessions.filter((s) => s.drug?.name && s.drug.name !== 'null').length;
  const scores = sessions.filter((s) => s.drugResponse?.efficacyScore != null).map((s) => s.drugResponse.efficacyScore);
  const avgEfficacy = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  return (
    <div className="patient-page">
      <div className="patient-page-back">
        <Link to={`/patient/${patientId}`} className="btn-text">← Back</Link>
      </div>
      <div className="patient-header">
        <div className="patient-name-large" style={{ fontSize: 20 }}>Treatment History</div>
      </div>

      {/* Summary strip */}
      <div className="history-stats-strip">
        <div className="history-stat"><div className="stat-num">{totalBottles}</div><div className="stat-lbl">Total Bottles</div></div>
        <div className="history-stat"><div className="stat-num">{medsGiven}</div><div className="stat-lbl">Medications</div></div>
        <div className="history-stat"><div className="stat-num">{avgEfficacy != null ? `${avgEfficacy}%` : '—'}</div><div className="stat-lbl">Avg. Effectiveness</div></div>
        <div className="history-stat"><div className="stat-num">{groups.length}</div><div className="stat-lbl">Days Monitored</div></div>
      </div>

      {loading && <div className="patient-loading">Loading history...</div>}

      {groups.map(([dateStr, daySessions]) => (
        <div key={dateStr} className="history-group">
          <div className="history-group-header">
            {formatGroupDate(dateStr)} — {daySessions.length} {daySessions.length === 1 ? 'bottle' : 'bottles'}
          </div>
          {daySessions.map((s) => (
            <div key={s._id} className="history-row">
              <span className="history-row-bottle">Bottle {s.bottleNumber}</span>
              <span className="history-row-drug">{s.drug?.name && s.drug.name !== 'null' ? s.drug.name : 'No medication'}</span>
              <span className="history-row-time">{fmtTime(s.startTime)} – {fmtTime(s.endTime)}</span>
              <EfficacyPill score={s.drugResponse?.efficacyScore} />
              <Link to={`/patient/${patientId}/bottle/${s._id}`} className="btn-text history-row-link">View Report →</Link>
            </div>
          ))}
        </div>
      ))}

      {!loading && groups.length === 0 && (
        <div className="patient-loading">No history available yet.</div>
      )}
    </div>
  );
}

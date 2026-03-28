import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { statusColor, fmtHR, fmtSpO2, fmtFlow } from '../utils/formatVitals';

function Sparkline({ data, color = '#00d4ff' }) {
  if (!data || data.length < 2) return null;
  const W = 300, H = 40;
  const min = Math.min(...data) - 2;
  const max = Math.max(...data) + 2;
  const scaleY = (v) => H - ((v - min) / (max - min)) * (H - 4) - 2;
  const scaleX = (i) => (i / (data.length - 1)) * W;

  const pts = data.map((v, i) => `${scaleX(i).toFixed(1)},${scaleY(v).toFixed(1)}`).join(' ');
  const fillPts = `0,${H} ${pts} ${W},${H}`;
  const id = `sg-${color.replace('#', '')}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 40 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export default function PatientCard({ patient, liveData }) {
  const navigate = useNavigate();
  const p = { ...patient, ...(liveData || {}) };
  const sc = statusColor(p.status);
  const [hrHistory] = useState(() =>
    Array.from({ length: 40 }, () => (p.hr || 75) + (Math.random() - 0.5) * 12)
  );

  const valveColor = p.valve === 'OPEN' ? 'var(--accent-green)' : 'var(--accent-red)';
  const hrVal = fmtHR(p.hr);
  const spo2Val = fmtSpO2(p.spo2);
  const flowVal = fmtFlow(p.ivFlow);
  const isAlert = ['ALERT', 'CRITICAL'].includes((p.status || '').toUpperCase());
  const hrClass = p.hr > 100 || p.hr < 50 ? 'danger' : p.hr > 90 ? 'warn' : 'green';
  const spo2Class = p.spo2 < 90 ? 'danger' : p.spo2 < 94 ? 'warn' : 'green';

  return (
    <div className={`patient-card ${sc}`}>
      {/* Header */}
      <div className="pc-header">
        <div className="pc-id-group">
          <div className="pc-id mono">{p.patientId}</div>
          <div className="pc-room mono">{p.room}</div>
          <div className="pc-name">{p.name}</div>
        </div>
        <div className={`status-pill ${sc.replace('status-', '')}`}>
          <span className="status-dot-sm" />
          {(p.status || 'STABLE').toUpperCase()}
        </div>
      </div>

      {/* Metrics */}
      <div className="pc-metrics">
        <div className="pc-metric">
          <div className="pc-metric-label">IV FLOW</div>
          <div className="pc-metric-val teal">
            {flowVal}<span className="pc-metric-unit"> mL/hr</span>
          </div>
        </div>
        <div className="pc-metric">
          <div className="pc-metric-label">SpO₂</div>
          <div className={`pc-metric-val ${spo2Class}`}>
            {spo2Val}<span className="pc-metric-unit">%</span>
          </div>
        </div>
        <div className="pc-metric">
          <div className="pc-metric-label">HEART RATE</div>
          <div className={`pc-metric-val heartbeat ${hrClass}`}>
            {hrVal}<span className="pc-metric-unit"> BPM</span>
          </div>
        </div>
        <div className="pc-metric">
          <div className="pc-metric-label">VALVE</div>
          <div className="pc-metric-val" style={{ color: valveColor, fontSize: 13 }}>
            {p.valve || 'OPEN'}
          </div>
        </div>
      </div>

      {/* Sparkline */}
      <Sparkline
        data={hrHistory}
        color={isAlert ? 'var(--accent-red)' : p.status === 'MONITORING' ? 'var(--accent-yellow)' : 'var(--accent-teal)'}
      />

      {/* Footer */}
      <div className="pc-footer">
        <div className="pc-drug mono">{p.drug}</div>
        <button className="btn-view-details" onClick={() => navigate(`/patient/${p.patientId}`)}>
          VIEW DETAILS →
        </button>
      </div>
    </div>
  );
}

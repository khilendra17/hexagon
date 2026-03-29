/**
 * StatusIndicator.jsx
 * 3-column current-status card for patient home.
 * Plain English, no medical jargon.
 */
import { hrLabel, spo2Label } from '../../utils/insightGenerator';

/* Animated SVG heart icon */
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="status-icon">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z"/>
    </svg>
  );
}

/* IV Drip icon */
function IVIcon({ ivStatus }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="status-icon">
      <path d="M12 3v11M8 6h8M9 10h6M10 14h4"/>
      <rect x="6" y="3" width="12" height="12" rx="2"/>
      <line x1="12" y1="14" x2="12" y2="21"/>
      {ivStatus === 'running' && <ellipse cx="12" cy="21" rx="2" ry="3" fill="#2C7BE5" stroke="none" className="iv-drip-anim"/>}
    </svg>
  );
}

/* Lung/oxygen icon */
function LungIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="status-icon">
      <path d="M6.5 9A4.5 4.5 0 002 13.5V17a3 3 0 006 0v-3a1 1 0 011-1h6a1 1 0 011 1v3a3 3 0 006 0v-3.5A4.5 4.5 0 0017.5 9"/>
      <path d="M12 3v10"/>
    </svg>
  );
}

const LEVEL_COLORS = { normal: 'positive-green', warning: 'warn-amber', critical: 'alert-red' };

function colClass(level) {
  return `status-indicator-level ${LEVEL_COLORS[level] || 'positive-green'}`;
}

export default function StatusIndicator({ latest, ivStatus = 'running', ivRemaining = 500 }) {
  const hr = latest?.heartRate;
  const spo2 = latest?.spo2;
  const hrInfo = hrLabel(hr);
  const spo2Info = spo2Label(spo2);
  const estHours = ivRemaining > 0 ? (ivRemaining / 45).toFixed(1) : '—';
  const ivInfo = ivStatus === 'stopped'
    ? { text: 'Drip Paused — Doctor Aware', level: 'warning' }
    : ivRemaining < 100
    ? { text: 'Bottle Almost Empty', level: 'warning' }
    : { text: 'Drip Running Normally', level: 'normal' };

  return (
    <div className="status-indicator-grid">
      {/* Heart Rate */}
      <div className="status-indicator-card">
        <div className={`status-icon-wrap heart-pulse ${hrInfo.level}`}>
          <HeartIcon />
        </div>
        <div className="status-indicator-label">Heart Rate</div>
        <div className={colClass(hrInfo.level)}>{hrInfo.text}</div>
        <div className="status-indicator-sub">{hr ? `${Math.round(hr)} beats per minute` : 'Loading...'}</div>
      </div>

      {/* Blood Oxygen */}
      <div className="status-indicator-card">
        <div className={`status-icon-wrap ${spo2Info.level}`}>
          <LungIcon />
        </div>
        <div className="status-indicator-label">Blood Oxygen</div>
        <div className={colClass(spo2Info.level)}>{spo2Info.text}</div>
        <div className="status-indicator-sub">{spo2 ? `${spo2.toFixed(1)}% oxygen saturation` : 'Loading...'}</div>
      </div>

      {/* IV Drip */}
      <div className="status-indicator-card">
        <div className={`status-icon-wrap ${ivInfo.level}`}>
          <IVIcon ivStatus={ivStatus} />
        </div>
        <div className="status-indicator-label">IV Drip</div>
        <div className={colClass(ivInfo.level)}>{ivInfo.text}</div>
        <div className="status-indicator-sub">{ivRemaining.toFixed(0)} mL remaining · ~{estHours}h left</div>
      </div>
    </div>
  );
}

/**
 * PlanBanner.jsx
 * Displays a rich Basic / Premium plan card in the patient view.
 * Shows current plan with feature highlights and a clear upgrade prompt for basic users.
 */
import { usePlan } from '../../hooks/usePlan.js';

const BASIC_INCLUDED = [
  { icon: '❤️', label: 'Heart Rate monitoring' },
  { icon: '🩸', label: 'SpO₂ (oxygen level)' },
  { icon: '💧', label: 'IV Drip monitoring' },
  { icon: '🎥', label: 'Patient live streaming' },
];

const BASIC_EXCLUDED = [
  { icon: '⛔', label: 'Drug impact curve' },
  { icon: '⛔', label: 'Graphs / analytics' },
  { icon: '⛔', label: 'Smart suggestions (avoid specific drugs)' },
];

const PREMIUM_PLUS = [
  { icon: '📉', label: 'Drug impact curve' },
  { icon: '📊', label: 'Graphs / analytics' },
  { icon: '🧠', label: 'Smart suggestions (avoid specific drugs)' },
  { icon: '🩺', label: 'Doctor-specific features' },
  { icon: '🔐', label: 'Doctor ID-based access' },
  { icon: '🖥️', label: 'Doctor dashboard + login window' },
  { icon: '⚙️', label: 'Plan-based access control (Basic / Premium)' },
];

export default function PlanBanner() {
  const { plan, isPremium } = usePlan();

  if (!plan) return null;

  return (
    <div className="plan-banner-wrap">
      {/* ── Basic Plan Card ── */}
      <div className={`plan-tier-card ${!isPremium ? 'plan-tier-active' : 'plan-tier-inactive'}`}>
        <div className="plan-tier-header">
          <span className="plan-tier-badge basic-badge">Basic Plan</span>
          {!isPremium && <span className="plan-tier-current-tag">✓ Your Plan</span>}
        </div>
        <p className="plan-tier-desc">Essential real-time monitoring for patients and family.</p>
        <div className="plan-feature-subtitle">Includes</div>
        <ul className="plan-feature-list">
          {BASIC_INCLUDED.map((f) => (
            <li key={f.label} className="plan-feature-item">
              <span className="plan-feature-icon">{f.icon}</span>
              <span>{f.label}</span>
            </li>
          ))}
        </ul>
        <div className="plan-feature-subtitle">Does not include</div>
        <ul className="plan-feature-list">
          {BASIC_EXCLUDED.map((f) => (
            <li key={f.label} className="plan-feature-item excluded">
              <span className="plan-feature-icon">{f.icon}</span>
              <span>{f.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Premium Plan Card ── */}
      <div className={`plan-tier-card ${isPremium ? 'plan-tier-active premium-active' : 'plan-tier-inactive'}`}>
        <div className="plan-tier-header">
          <span className="plan-tier-badge premium-badge">Premium Plan ★</span>
          {isPremium && <span className="plan-tier-current-tag">✓ Your Plan</span>}
        </div>
        <p className="plan-tier-desc">Everything in Basic, plus analytics, doctor tools, and recommendations.</p>
        <div className="plan-feature-subtitle">Includes everything in Basic +</div>
        <ul className="plan-feature-list">
          {BASIC_INCLUDED.map((f) => (
            <li key={f.label} className="plan-feature-item included">
              <span className="plan-feature-icon">✓</span>
              <span>{f.label}</span>
            </li>
          ))}
          {PREMIUM_PLUS.map((f) => (
            <li key={f.label} className={`plan-feature-item ${isPremium ? 'premium-highlight' : 'locked-feature'}`}>
              <span className="plan-feature-icon">{isPremium ? f.icon : '🔒'}</span>
              <span>{f.label}</span>
            </li>
          ))}
        </ul>
        {!isPremium && (
          <div className="plan-upgrade-note">
            Ask your doctor or nursing staff to upgrade to Premium access.
          </div>
        )}
      </div>

      <div className="plan-system-note">
        Tiered health monitoring system: Basic covers live patient vitals and stream, while Premium adds advanced analytics, smart drug guidance, and doctor-controlled dashboard access.
      </div>
    </div>
  );
}

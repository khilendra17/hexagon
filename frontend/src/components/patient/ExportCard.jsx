/**
 * ExportCard.jsx
 * A single sharing/export card with toggle and optional action button.
 */
export default function ExportCard({ title, description, enabled, onToggle, actionLabel, onAction, children }) {
  return (
    <div className={`export-card ${enabled ? 'enabled' : ''}`}>
      <div className="export-card-header">
        <div className="export-card-title-block">
          <div className="export-card-title">{title}</div>
          {description && <div className="export-card-desc">{description}</div>}
        </div>
        <button
          className={`export-toggle ${enabled ? 'on' : 'off'}`}
          onClick={onToggle}
          aria-label={enabled ? 'Disable sharing' : 'Enable sharing'}
        >
          <span className="toggle-knob" />
        </button>
      </div>

      {enabled && children && (
        <div className="export-card-body">{children}</div>
      )}

      {enabled && actionLabel && (
        <button className="btn export-action-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/**
 * InsightBanner.jsx
 * Plain-language drug response strip (PRD §12.3 / §8.7).
 */
const LEVEL_STYLES = {
  normal: { bg: 'var(--blue-bg)', border: 'var(--blue)', color: 'var(--blue-dark)', icon: '💡' },
  warning: { bg: 'var(--amber-bg)', border: 'var(--amber)', color: '#92600A', icon: '⚠️' },
  critical: { bg: 'var(--red-bg)', border: 'var(--red)', color: 'var(--red-dark)', icon: '🔴' },
};

export default function InsightBanner({ insight, isLoading }) {
  if (isLoading || !insight?.message) return null;

  const level = insight.level || 'normal';
  const style = LEVEL_STYLES[level] || LEVEL_STYLES.normal;

  return (
    <div
      className="insight-banner"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
      }}
    >
      <span className="insight-banner-icon">{style.icon}</span>
      <span className="insight-banner-text">{insight.message}</span>
    </div>
  );
}

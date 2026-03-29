export default function InsightBanner({ text }) {
  if (!text) return null;
  return (
    <div
      className="insight-banner"
      style={{
        fontFamily: 'var(--mono)',
        fontSize: 12,
        lineHeight: 1.5,
        color: 'var(--text-primary)',
        padding: '12px 14px',
        marginBottom: 12,
        border: '1px solid var(--border)',
        borderRadius: 6,
        background: 'rgba(0, 212, 255, 0.06)',
      }}
    >
      {text}
    </div>
  );
}

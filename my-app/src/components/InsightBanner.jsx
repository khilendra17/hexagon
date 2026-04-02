export default function InsightBanner({ insight }) {
  const text = insight?.insight;
  if (!text) return null;

  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 10,
        border: "1px solid var(--border)",
        background: "var(--accent-bg)",
        color: "var(--text-h)",
        textAlign: "left",
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>Clinical insight</div>
      <div style={{ fontSize: 16 }}>{text}</div>
    </div>
  );
}


const SEVERITY_STYLES = {
  critical: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.6)", color: "#ef4444" },
  warning: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.6)", color: "#f59e0b" },
  info: { bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.55)", color: "#9ca3af" },
};

export default function AlertPanel({ alerts }) {
  const list = (alerts || []).slice(0, 20);
  if (!list.length) {
    return (
      <div style={{ padding: 12, color: "var(--text)", border: "1px dashed var(--border)", borderRadius: 10 }}>
        No alerts yet.
      </div>
    );
  }

  return (
    <div>
      {list.map((a) => {
        const sev = String(a.severity || "info").toLowerCase();
        const style = SEVERITY_STYLES[sev] || SEVERITY_STYLES.info;
        const ts = a.timestamp ? new Date(a.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

        return (
          <div
            key={a._id || `${a.type}-${a.timestamp}`}
            style={{
              padding: 12,
              borderRadius: 10,
              border: `1px solid ${style.border}`,
              background: style.bg,
              color: style.color,
              marginBottom: 10,
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 4 }}>
              {a.type} {ts ? <span style={{ marginLeft: 8, color: "inherit" }}>@ {ts}</span> : null}
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-h)" }}>{a.message}</div>
          </div>
        );
      })}
    </div>
  );
}


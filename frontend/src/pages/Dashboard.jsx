import { useLiveFeed } from "../hooks/useLiveFeed";
import DrugCurveChart from "../components/DrugCurveChart";

function severityColor(sev) {
  if (sev === "critical") return "crimson";
  if (sev === "warning") return "#b45309";
  return "#6b7280";
}

export default function Dashboard() {
  const { vitals, alerts, insight, vision, connected } = useLiveFeed();
  const latest = vitals?.[0];

  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 style={{ margin: 0 }}>Monitoring Dashboard</h2>
        <div style={{ fontSize: 12, opacity: 0.75 }}>{connected ? "LIVE" : "offline"}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginTop: 16 }}>
        <div style={{ border: "1px solid #e5e7eb", padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Heart rate</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{latest ? latest.heartRate : "—"}</div>
        </div>
        <div style={{ border: "1px solid #e5e7eb", padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>SpO₂</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{latest ? latest.spo2 : "—"}</div>
        </div>
        <div style={{ border: "1px solid #e5e7eb", padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>IV status</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{latest ? latest.ivStatus : "—"}</div>
        </div>
      </div>

      {insight?.insight && (
        <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: "#f0f9ff", border: "1px solid #bae6fd" }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>Clinical insight</div>
          <div>{insight.insight}</div>
          <div style={{ marginTop: 10 }}>
            <DrugCurveChart payload={insight} />
          </div>
        </div>
      )}

      <div style={{ marginTop: 14, padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>IV vision status</div>
        <div style={{ fontWeight: 700 }}>
          {vision?.status ? vision.status : "unavailable"}
        </div>
        {vision?.message && <div style={{ fontSize: 12, opacity: 0.8 }}>{vision.message}</div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginTop: 14 }}>
        <div style={{ border: "1px solid #e5e7eb", padding: 12, borderRadius: 8, minHeight: 220 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>Recent alerts</div>
          <div style={{ display: "grid", gap: 6, maxHeight: 260, overflow: "auto" }}>
            {(alerts || []).slice(0, 30).map((a) => (
              <div key={a._id || `${a.type}-${a.timestamp}`} style={{ borderLeft: `3px solid ${severityColor(a.severity)}`, paddingLeft: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: severityColor(a.severity) }}>
                  {a.severity?.toUpperCase()} · {a.type}
                </div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{a.message}</div>
              </div>
            ))}
            {!alerts?.length && <div style={{ fontSize: 12, opacity: 0.6 }}>No alerts yet.</div>}
          </div>
        </div>

        <div style={{ border: "1px solid #e5e7eb", padding: 12, borderRadius: 8, minHeight: 220 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>Recent vitals</div>
          <div style={{ display: "grid", gap: 6, maxHeight: 260, overflow: "auto", fontSize: 12 }}>
            {(vitals || []).slice(0, 30).map((v) => (
              <div key={v._id || v.timestamp} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <span style={{ opacity: 0.75 }}>{new Date(v.timestamp).toLocaleTimeString()}</span>
                <span>HR {v.heartRate}</span>
                <span>SpO₂ {v.spo2}</span>
                <span style={{ opacity: 0.75 }}>{v.ivStatus}</span>
              </div>
            ))}
            {!vitals?.length && <div style={{ opacity: 0.6 }}>No vitals yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}


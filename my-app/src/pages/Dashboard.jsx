import VitalsChart from "../components/VitalsChart.jsx";
import AlertPanel from "../components/AlertPanel.jsx";
import InsightBanner from "../components/InsightBanner.jsx";
import DrugImpactChart from "../components/DrugImpactChart.jsx";
import { useLiveFeed } from "../hooks/useLiveFeed.js";

export default function Dashboard({ token, role, onLogout }) {
  const { vitals, alerts, insight, visionStatus, loading } = useLiveFeed({ token });

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <div style={{ fontSize: 13, opacity: 0.85 }}>
            Role: <b>{role}</b> · Vision: <b>{visionStatus || "waiting..."}</b>
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "transparent",
            cursor: "pointer",
            color: "var(--text-h)",
            height: 40,
          }}
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div style={{ opacity: 0.85, marginBottom: 14 }}>Loading vitals, alerts, and insights...</div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16 }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 14, background: "var(--bg)" }}>
          <div style={{ fontSize: 13, opacity: 0.85, textAlign: "left", marginBottom: 8 }}>Live vitals (HR + SpO2)</div>
          <VitalsChart vitals={vitals} />
        </div>

        <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 14, background: "var(--bg)" }}>
          <div style={{ fontSize: 13, opacity: 0.85, textAlign: "left", marginBottom: 8 }}>Clinical alerts</div>
          <AlertPanel alerts={alerts} />
        </div>
      </div>

      <div style={{ marginTop: 16, border: "1px solid var(--border)", borderRadius: 12, padding: 14, background: "var(--bg)" }}>
        <InsightBanner insight={insight} />
        <div style={{ fontSize: 13, opacity: 0.85, textAlign: "left", marginBottom: 8 }}>
          Drug Impact Curve (IV start → 30 minutes)
        </div>
        <DrugImpactChart insight={insight} />
      </div>
    </div>
  );
}


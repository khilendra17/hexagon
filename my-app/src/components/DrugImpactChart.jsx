import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

function formatClock(ms) {
  if (!Number.isFinite(ms)) return "";
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function DrugImpactChart({ insight }) {
  if (!insight?.vitalsTimeline?.length) {
    return (
      <div style={{ padding: 12, color: "var(--text)", fontSize: 14, opacity: 0.85 }}>
        No drug curve data yet.
      </div>
    );
  }

  const points = insight.vitalsTimeline
    .map((v) => ({
      t: new Date(v.timestamp).getTime(),
      heartRate: v.heartRate,
      spo2: v.spo2,
    }))
    .filter((p) => Number.isFinite(p.t));

  const ivStartMs = insight.ivStartTime ? new Date(insight.ivStartTime).getTime() : null;

  return (
    <div style={{ width: "100%", height: 330 }}>
      <LineChart data={points}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="t"
          tickFormatter={formatClock}
          type="number"
          domain={["auto", "auto"]}
        />
        <YAxis yAxisId="hr" allowDecimals={false} />
        <YAxis yAxisId="spo2" orientation="right" allowDecimals={false} />
        <Tooltip
          labelFormatter={(label) => formatClock(label)}
          formatter={(value, name) => [value, name === "heartRate" ? "Heart Rate" : "SpO2"]}
        />
        <Legend />

        {Number.isFinite(ivStartMs) && (
          <ReferenceLine
            x={ivStartMs}
            label="IV start"
            stroke="rgba(170,59,255,0.9)"
          />
        )}

        <Line yAxisId="hr" type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#3b82f6" dot={false} />
        <Line yAxisId="spo2" type="monotone" dataKey="spo2" name="SpO2" stroke="#10b981" dot={false} />
      </LineChart>
    </div>
  );
}


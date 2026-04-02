import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

function formatClock(ms) {
  if (!Number.isFinite(ms)) return "";
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function VitalsChart({ vitals }) {
  const points = (vitals || []).map((v) => {
    const t = new Date(v.timestamp).getTime();
    return {
      t,
      heartRate: v.heartRate,
      spo2: v.spo2,
    };
  });

  return (
    <div style={{ width: "100%", height: 300 }}>
      <LineChart data={points}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="t"
          tickFormatter={formatClock}
          domain={["auto", "auto"]}
          type="number"
        />
        <YAxis yAxisId="hr" allowDecimals={false} />
        <YAxis yAxisId="spo2" orientation="right" allowDecimals={false} />
        <Tooltip
          labelFormatter={(label) => formatClock(label)}
          formatter={(value, name) => [value, name === "heartRate" ? "Heart Rate" : "SpO2"]}
        />
        <Legend />
        <Line yAxisId="hr" type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#3b82f6" dot={false} />
        <Line yAxisId="spo2" type="monotone" dataKey="spo2" name="SpO2" stroke="#10b981" dot={false} />
      </LineChart>
    </div>
  );
}


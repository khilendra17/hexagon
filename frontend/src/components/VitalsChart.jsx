import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function VitalsChart({ vitals }) {
  const data = vitals.map((v) => ({
    time: new Date(v.timestamp).getTime(),
    heartRate: v.heartRate,
    spo2: v.spo2,
  }));

  return (
    <div className="h-72 w-full rounded-lg border border-slate-800 bg-slate-900/80 p-3">
      <p className="mb-2 text-sm font-medium text-slate-300">Vitals over time</p>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            type="number"
            dataKey="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(t) => new Date(t).toLocaleTimeString()}
            stroke="#94a3b8"
            fontSize={11}
          />
          <YAxis stroke="#94a3b8" fontSize={11} />
          <Tooltip
            labelFormatter={(t) => new Date(t).toLocaleString()}
            contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
          />
          <Legend />
          <Line type="monotone" dataKey="heartRate" name="Heart rate" stroke="#38bdf8" dot={false} />
          <Line type="monotone" dataKey="spo2" name="SpO₂" stroke="#a78bfa" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

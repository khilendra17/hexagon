import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';

export default function DrugCurveChart({ payload }) {
  const ivStartTime = payload?.ivStartTime;
  const timeline = payload?.vitalsTimeline ?? [];
  if (!ivStartTime || !timeline.length) {
    return (
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 12,
          color: 'var(--text-muted)',
          padding: 16,
        }}
      >
        No IV event recorded in this session or insufficient post-IV vitals.
      </div>
    );
  }

  const ivStart = new Date(ivStartTime).getTime();
  const data = timeline.map((v) => {
    const ts = new Date(v.timestamp).getTime();
    return {
      tMin: (ts - ivStart) / 60000,
      heartRate: v.heartRate,
      spo2: v.spo2,
    };
  });

  const tVals = data.map((d) => d.tMin);
  const xMin = Math.min(0, ...tVals);
  const xMax = Math.max(30, ...tVals);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="tMin"
          type="number"
          domain={[xMin, xMax]}
          tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: 'var(--text-muted)' }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
          label={{ value: 'Minutes after IV start', position: 'bottom', offset: 0, fontSize: 10, fill: 'var(--text-muted)' }}
        />
        <YAxis
          yAxisId="hr"
          tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: 'var(--text-muted)' }}
          tickLine={false}
          axisLine={false}
          label={{ value: 'HR', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'var(--text-muted)' }}
        />
        <YAxis
          yAxisId="spo2"
          orientation="right"
          domain={[80, 100]}
          tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: 'var(--text-muted)' }}
          tickLine={false}
          axisLine={false}
          label={{ value: 'SpO₂', angle: 90, position: 'insideRight', fontSize: 10, fill: 'var(--text-muted)' }}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border)',
            fontFamily: 'IBM Plex Mono',
            fontSize: 11,
          }}
          formatter={(v, name) => [v, name === 'heartRate' ? 'HR (bpm)' : 'SpO₂ (%)']}
          labelFormatter={(t) => `T+${Number(t).toFixed(1)} min`}
        />
        <Legend wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 10 }} />
        <ReferenceLine
          x={0}
          stroke="var(--accent-red)"
          strokeDasharray="4 4"
          label={{ value: 'IV start', fill: 'var(--accent-red)', fontFamily: 'IBM Plex Mono', fontSize: 9 }}
        />
        <Line
          yAxisId="hr"
          type="monotone"
          dataKey="heartRate"
          name="Heart rate"
          stroke="#00d4ff"
          dot={false}
          strokeWidth={2}
          isAnimationActive={false}
        />
        <Line
          yAxisId="spo2"
          type="monotone"
          dataKey="spo2"
          name="SpO₂"
          stroke="#00ff88"
          dot={false}
          strokeWidth={2}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

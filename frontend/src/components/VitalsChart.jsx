import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="ct-label">T+{label}s</div>
      {payload.map((p) => (
        <div key={p.dataKey}>
          <span className="ct-label">{p.name}: </span>
          <span className="ct-val" style={{ color: p.color }}>
            {Number(p.value).toFixed(1)}{p.dataKey === 'hr' ? ' BPM' : '%'}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function VitalsChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="t"
          tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: 'var(--text-muted)' }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
          tickFormatter={(v) => `${v}s`}
          interval={9}
        />
        <YAxis
          yAxisId="hr"
          domain={['auto', 'auto']}
          tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: '#00d4ff' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${Math.round(v)}`}
        />
        <YAxis
          yAxisId="spo2"
          orientation="right"
          domain={['auto', 100]}
          tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: '#00ff88' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--text-muted)' }}
        />
        <Line
          yAxisId="hr"
          type="monotone"
          dataKey="hr"
          name="Heart Rate"
          stroke="#00d4ff"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          strokeShadowColor="#00d4ff"
        />
        <Line
          yAxisId="spo2"
          type="monotone"
          dataKey="spo2"
          name="SpO₂"
          stroke="#00ff88"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

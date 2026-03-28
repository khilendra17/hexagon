import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend, Area,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="ct-label">T+{label} min</div>
      {payload.map((p) => (
        p.dataKey !== 'infusion' && (
          <div key={p.dataKey}>
            <span className="ct-label">{p.name}: </span>
            <span className="ct-val" style={{ color: p.color }}>
              {p.value >= 0 ? '+' : ''}{Number(p.value).toFixed(2)}
              {p.dataKey === 'spo2Delta' ? '%' : ' BPM'}
            </span>
          </div>
        )
      ))}
    </div>
  );
}

export default function DrugImpactChart({ data = [], drug = '', responseDelay = '5m 35s', effectiveness = 87 }) {
  return (
    <div>
      <div className="drug-impact-header">
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 4 }}>
            DRUG: <span style={{ color: 'var(--text-primary)' }}>{drug || 'N/A'}</span>
          </div>
        </div>
        <div className="drug-impact-tags">
          <span className="drug-impact-pill delay">RESPONSE: {responseDelay}</span>
          <span className="drug-impact-pill effect">EFFECTIVENESS: {effectiveness}%</span>
          <span className="drug-impact-pill baseline">BASELINE: 5 MIN</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="t"
            tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
            tickFormatter={(v) => `T+${v}`}
            interval={4}
          />
          <YAxis
            yAxisId="delta"
            tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis yAxisId="infusion" hide domain={[0, 2]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--text-muted)' }}
          />
          <Bar
            yAxisId="infusion"
            dataKey="infusion"
            name="IV Start"
            fill="rgba(255,59,92,0.35)"
            stroke="var(--accent-red)"
            strokeWidth={1}
            maxBarSize={12}
          />
          <ReferenceLine
            yAxisId="delta"
            x={5}
            stroke="var(--accent-red)"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{ value: 'INFUSION', position: 'insideTopRight', fontFamily: 'IBM Plex Mono', fontSize: 9, fill: 'var(--accent-red)' }}
          />
          <Area
            yAxisId="delta"
            type="monotone"
            dataKey="spo2Delta"
            name="SpO₂ Δ"
            stroke="#00ff88"
            strokeWidth={2}
            fill="rgba(0,255,136,0.08)"
            dot={false}
            isAnimationActive
          />
          <Line
            yAxisId="delta"
            type="monotone"
            dataKey="hrDelta"
            name="HR Δ"
            stroke="#00d4ff"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            isAnimationActive
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div style={{ textAlign: 'center', marginTop: 12, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
        ↑ Δ SpO₂ (%) and Δ HR (BPM) relative to pre-infusion baseline · Annotations shown at T+5
      </div>
    </div>
  );
}

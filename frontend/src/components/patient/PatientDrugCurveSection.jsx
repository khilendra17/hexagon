import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';

function formatTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip" style={{ background: '#fff', border: '1px solid #E2E6EA', padding: 8, borderRadius: 6 }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>T+{Number(label).toFixed(1)} min</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ fontSize: 12 }}>
          {p.name}: <strong>{Number(p.value).toFixed(1)}</strong>
        </div>
      ))}
    </div>
  );
}

/**
 * PRD §12.3 — Drug Impact Curve with IV reference line and dual vitals.
 */
export default function PatientDrugCurveSection({ rawInsight }) {
  if (!rawInsight?.vitalsTimeline?.length && !rawInsight?.insight) {
    return (
      <div className="patient-prd-card patient-drug-empty">
        <div className="patient-section-title">Drug Impact Curve</div>
        <p className="patient-muted-text">No IV event recorded in this session.</p>
      </div>
    );
  }

  const timeline = (rawInsight.vitalsTimeline || []).map((p) => ({
    t: Number(p.t),
    hr: p.heartRate,
    spo2: p.spo2,
  }));

  return (
    <div className="patient-prd-card">
      <div className="patient-section-title">Drug Impact Curve</div>
      {rawInsight.insight && (
        <div className="patient-insight-clinical" style={{ fontSize: 14, marginBottom: 12, lineHeight: 1.45 }}>
          {rawInsight.insight}
        </div>
      )}
      {timeline.length > 0 ? (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={timeline} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
            <XAxis
              dataKey="t"
              tick={{ fontSize: 11 }}
              label={{ value: 'Minutes after IV start', position: 'bottom', offset: -4, fontSize: 11 }}
            />
            <YAxis yAxisId="hr" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
            <YAxis yAxisId="spo2" orientation="right" tick={{ fontSize: 10 }} domain={[80, 100]} />
            <Tooltip content={formatTooltip} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={0} stroke="#D93025" strokeDasharray="4 4" label={{ value: 'IV start', fill: '#D93025', fontSize: 10 }} />
            <Line yAxisId="hr" type="monotone" dataKey="hr" name="Heart rate (BPM)" stroke="#2C7BE5" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line yAxisId="spo2" type="monotone" dataKey="spo2" name="SpO₂ (%)" stroke="#00A86B" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="patient-muted-text">Chart data will appear after the observation window completes.</p>
      )}
    </div>
  );
}

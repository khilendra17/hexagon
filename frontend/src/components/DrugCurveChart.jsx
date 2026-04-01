export default function DrugCurveChart({ payload }) {
  const timeline = payload?.vitalsTimeline || [];
  if (!timeline.length) return null;

  const pts = timeline.map((v) => ({
    t: new Date(v.timestamp).getTime(),
    hr: v.heartRate,
    spo2: v.spo2,
  }));

  const t0 = new Date(payload.ivStartTime).getTime();
  const times = pts.map((p) => p.t);
  const minT = Math.min(t0, ...times);
  const maxT = Math.max(t0 + 30 * 60000, ...times);

  const hrVals = pts.map((p) => p.hr);
  const spVals = pts.map((p) => p.spo2);
  const minY = Math.min(...hrVals, ...spVals) - 5;
  const maxY = Math.max(...hrVals, ...spVals) + 5;

  const w = 520;
  const h = 160;
  const pad = 20;

  const x = (t) => pad + ((t - minT) / (maxT - minT || 1)) * (w - pad * 2);
  const y = (v) => pad + (1 - (v - minY) / (maxY - minY || 1)) * (h - pad * 2);

  const line = (key) =>
    pts.map((p) => `${x(p.t).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");

  const xIv = x(t0);

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <rect x="0" y="0" width={w} height={h} fill="#fff" stroke="#e5e7eb" rx="8" />
      <line x1={xIv} y1={pad} x2={xIv} y2={h - pad} stroke="#ef4444" strokeDasharray="4 4" />
      <polyline fill="none" stroke="#00d4ff" strokeWidth="2" points={line("hr")} />
      <polyline fill="none" stroke="#00ff88" strokeWidth="2" points={line("spo2")} />
      <text x={xIv + 4} y={pad + 10} fontSize="10" fill="#ef4444">IV start</text>
      <text x={pad} y={h - 6} fontSize="10" fill="#6b7280">HR (blue) / SpO₂ (green)</text>
    </svg>
  );
}


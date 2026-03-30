import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import VitalsChart from '../components/VitalsChart';
import DrugImpactChart from '../components/DrugImpactChart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MOCK_PATIENTS, generateHistory, generateDrugImpact, fmtHR, fmtSpO2, fmtFlow, statusColor } from '../utils/formatVitals';
import { ArrowLeft } from 'lucide-react';

export default function PatientDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const plan = localStorage.getItem('plan') || 'basic'; // 🔥 PLAN

  const patient = MOCK_PATIENTS.find((p) => p.patientId === id) || MOCK_PATIENTS[0];

  const [liveVitals, setLiveVitals] = useState({
    hr: patient.hr,
    spo2: patient.spo2,
    ivFlow: patient.ivFlow,
    valve: patient.valve,
    backflow: patient.backflow
  });

  const [history, setHistory] = useState(() => generateHistory(60, patient.hr, patient.spo2));
  const [drugData] = useState(generateDrugImpact);
  const [flowRate, setFlowRate] = useState(patient.ivFlow);
  const [valve, setValve] = useState(patient.valve);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => {
      setLiveVitals((prev) => {
        const next = {
          hr: Math.max(40, Math.min(180, prev.hr + (Math.random() - 0.5) * 3)),
          spo2: Math.max(80, Math.min(100, prev.spo2 + (Math.random() - 0.5) * 0.6)),
          ivFlow: flowRate,
          valve,
          backflow: prev.backflow,
        };
        setHistory((h) => [...h.slice(1), { t: h[h.length - 1].t + 1, hr: next.hr, spo2: next.spo2, ivFlow: next.ivFlow }]);
        return next;
      });
    }, 1500);
    return () => clearInterval(tick);
  }, [flowRate, valve]);

  async function toggleValve() {
    const newState = valve === 'OPEN' ? 'CLOSED' : 'OPEN';
    setSaving(true);
    try {
      await fetch('/api/control/valve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: id, state: newState }),
      });
    } catch (_) {}
    setValve(newState);
    setSaving(false);
  }

  async function adjustFlow(delta) {
    const newRate = Math.max(0, Math.min(200, flowRate + delta));
    setFlowRate(newRate);
    try {
      await fetch('/api/control/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: id, rate: newRate }),
      });
    } catch (_) {}
  }

  const sc = statusColor(patient.status);
  const hrClass = liveVitals.hr > 100 || liveVitals.hr < 50 ? 'red' : liveVitals.hr > 90 ? 'yellow' : 'green';
  const spo2Class = liveVitals.spo2 < 90 ? 'red' : liveVitals.spo2 < 94 ? 'yellow' : 'green';

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar title={`PATIENT DETAIL — ${id}`} />

        <div className="page-body">

          {/* PLAN INDICATOR */}
          <div style={{ marginBottom: 10, fontSize: 12, color: 'var(--text-muted)' }}>
            Current Plan: <strong style={{ color: '#00d4ff' }}>{plan.toUpperCase()}</strong>
          </div>

          {/* Back */}
          <button className="btn-back" onClick={() => nav(-1)}>
            <ArrowLeft size={12} /> BACK
          </button>

          {/* HEADER */}
          <div className="patient-detail-header">
            <div>
              <div>{patient.patientId}</div>
              <div>{patient.name}</div>
            </div>

            <div>
              <button onClick={toggleValve}>{valve}</button>
              <button onClick={() => adjustFlow(+5)}>+ Flow</button>
            </div>
          </div>

          {/* BASIC FEATURES (ALWAYS AVAILABLE) */}
          <div className="card">
            <div>Heart Rate: {fmtHR(liveVitals.hr)}</div>
            <div>SpO₂: {fmtSpO2(liveVitals.spo2)}</div>
            <div>IV Flow: {fmtFlow(liveVitals.ivFlow)}</div>
          </div>

          {/* VITALS CHART (KEEP FOR BASIC) */}
          <div className="card">
            <VitalsChart data={history} />
          </div>

          {/* PREMIUM SECTION */}
          {plan === "premium" ? (
            <>
              {/* IV FLOW GRAPH */}
              <div className="card">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="t" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="ivFlow" stroke="#00ff88" fill="rgba(0,255,136,0.1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* DRUG IMPACT */}
              <div className="card">
                <DrugImpactChart data={drugData} drug={patient.drug} />
              </div>
            </>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: 16 }}>🔒 Advanced Analysis Locked</div>
              <div style={{ fontSize: 12, color: "gray" }}>
                Upgrade to Premium to view drug impact & advanced analytics
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
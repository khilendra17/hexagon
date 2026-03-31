import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import VitalsChart from '../components/VitalsChart';
import DrugImpactChart from '../components/DrugImpactChart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_PATIENTS, generateHistory, generateDrugImpact, fmtHR, fmtSpO2, fmtFlow } from '../utils/formatVitals';
import { ArrowLeft } from 'lucide-react';

export default function PatientDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const plan = localStorage.getItem('plan') || 'basic';

  const patient = MOCK_PATIENTS.find((p) => p.patientId === id) || MOCK_PATIENTS[0];

  const [time, setTime] = useState(new Date());

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

  useEffect(() => {
    const tick = setInterval(() => {
      setTime(new Date());

      setLiveVitals((prev) => {
        const next = {
          hr: Math.max(40, Math.min(180, prev.hr + (Math.random() - 0.5) * 3)),
          spo2: Math.max(80, Math.min(100, prev.spo2 + (Math.random() - 0.5) * 0.6)),
          ivFlow: flowRate,
          valve,
          backflow: prev.backflow,
        };

        setHistory((h) => [...h.slice(1), {
          t: h[h.length - 1].t + 1,
          hr: next.hr,
          spo2: next.spo2,
          ivFlow: next.ivFlow
        }]);

        return next;
      });
    }, 1500);

    return () => clearInterval(tick);
  }, [flowRate, valve]);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar title={`PATIENT DETAIL — ${id}`} />

        <div className="page-body">

          {/* SYSTEM STATUS */}
          <div style={{ fontSize: 12, color: "lime" }}>
            ● System Status: Monitoring Active
          </div>

          {/* TIME */}
          <div style={{ fontSize: 10, color: "gray", marginBottom: 10 }}>
            Last Updated: {time.toLocaleTimeString()}
          </div>

          {/* PLAN */}
          <div style={{ marginBottom: 10 }}>
            Plan: <b style={{ color: "#00d4ff" }}>{plan.toUpperCase()}</b>
          </div>

          {/* BACK */}
          <button className="btn-back" onClick={() => nav(-1)}>
            <ArrowLeft size={12} /> BACK
          </button>

          {/* BASIC */}
          <div className="card">
            <div>Heart Rate: {fmtHR(liveVitals.hr)}</div>
            <div>SpO₂: {fmtSpO2(liveVitals.spo2)}</div>
            <div>IV Flow: {fmtFlow(liveVitals.ivFlow)}</div>
          </div>

          {/* CHART */}
          <div className="card">
            <VitalsChart data={history} />
          </div>

          {/* PREMIUM */}
          {plan === "premium" ? (
            <>
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

              <div className="card">
                <DrugImpactChart data={drugData} drug={patient.drug} />
              </div>

              {/* AI INSIGHT */}
              <div className="card">
                <div>💡 AI Insight</div>
                <div style={{ fontSize: 12, color: "gray" }}>
                  Patient responded positively. Oxygen improved and vitals stabilized within 5 minutes.
                </div>
              </div>
            </>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: 20 }}>
              <div>🔒 Advanced Features Locked</div>

              <div style={{ fontSize: 12, color: "gray" }}>
                Upgrade to Premium for AI insights & drug analysis
              </div>

              <button
                onClick={() => {
                  localStorage.setItem("plan", "premium");
                  window.location.reload();
                }}
                style={{
                  marginTop: 10,
                  padding: "8px 12px",
                  background: "#00d4ff",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Upgrade to Premium
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
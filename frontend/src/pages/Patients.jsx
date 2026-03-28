import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import PatientCard from '../components/PatientCard';
import { MOCK_PATIENTS } from '../utils/formatVitals';

export default function Patients() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar title="ALL PATIENTS" />
        <div className="page-body">
          <div className="page-header">
            <div>
              <div className="page-heading">PATIENT ROSTER</div>
              <div className="page-subhead">{MOCK_PATIENTS.length} patients · ICU Ward 3</div>
            </div>
            <div className="live-indicator">
              <span className="live-dot" />
              LIVE
            </div>
          </div>
          <div className="dashboard-grid">
            {MOCK_PATIENTS.map((p) => (
              <PatientCard key={p.patientId} patient={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

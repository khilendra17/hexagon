/**
 * PatientLayout.jsx
 * Minimal shell for the Patient / Family view.
 * Mobile-first, light theme. Includes a top bar with view switcher.
 */
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const DEFAULT_PATIENT_ID = 'rahul-sharma';

function ViewSwitcher() {
  const navigate = useNavigate();
  const loc = useLocation();
  const isPatient = loc.pathname.startsWith('/patient');

  function switchView(view) {
    localStorage.setItem('vitaflow_view', view);
    if (view === 'patient') {
      navigate(`/patient/${DEFAULT_PATIENT_ID}`);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="view-switcher">
      <button
        className={`view-pill${!isPatient ? ' active' : ''}`}
        onClick={() => switchView('doctor')}
      >
        Doctor View
      </button>
      <button
        className={`view-pill${isPatient ? ' active' : ''}`}
        onClick={() => switchView('patient')}
      >
        Patient View
      </button>
    </div>
  );
}

export default function PatientLayout() {
  const navigate = useNavigate();
  return (
    <div className="patient-shell">
      <nav className="patient-navbar">
        <div className="patient-navbar-brand" onClick={() => navigate(`/patient/${DEFAULT_PATIENT_ID}`)} style={{ cursor: 'pointer' }}>
          VitaFlow <span style={{ fontWeight: 400, color: 'var(--clinical-muted, #52606D)' }}>Family</span>
        </div>
        <ViewSwitcher />
      </nav>
      <main className="patient-main">
        <Outlet />
      </main>
    </div>
  );
}

/**
 * PatientLayout.jsx — shell for patient/family view (PRD §13).
 */
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const DEFAULT_SLUG = 'rahul-sharma';

function ViewSwitcher() {
  const navigate = useNavigate();
  const loc = useLocation();
  const { user } = useAuth();
  const isPatient = loc.pathname.startsWith('/patient');

  function switchView(view) {
    localStorage.setItem('vitaflow_view', view);
    if (view === 'patient') {
      const slug = user?.role === 'family' ? user.patientSlug || DEFAULT_SLUG : DEFAULT_SLUG;
      navigate(`/patient/${slug}`);
    } else {
      navigate('/');
    }
  }

  if (user?.role === 'family') {
    return null;
  }

  return (
    <div className="view-switcher">
      <button type="button" className={`view-pill${!isPatient ? ' active' : ''}`} onClick={() => switchView('doctor')}>
        Doctor view
      </button>
      <button type="button" className={`view-pill${isPatient ? ' active' : ''}`} onClick={() => switchView('patient')}>
        Patient view
      </button>
    </div>
  );
}

export default function PatientLayout() {
  const navigate = useNavigate();
  const { patientId = DEFAULT_SLUG } = useParams();
  const { logout, user } = useAuth();

  return (
    <div className="patient-shell">
      <nav className="patient-navbar">
        <button
          type="button"
          className="patient-navbar-brand"
          onClick={() => navigate(`/patient/${patientId}`)}
        >
          VitaFlow <span style={{ fontWeight: 400, color: 'var(--clinical-muted, #52606D)' }}>Family</span>
        </button>
        <ViewSwitcher />
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.name}</span>
          <button
            type="button"
            className="btn-text"
            style={{ fontSize: 13 }}
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Sign out
          </button>
        </div>
      </nav>
      <main className="patient-main">
        <Outlet />
      </main>
    </div>
  );
}

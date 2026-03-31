import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientDetail from './pages/PatientDetail';
import Patients from './pages/Patients';
import Alerts from './pages/Alerts';
import Logs from './pages/Logs';
import Settings from './pages/Settings';

/**
 * Auth Guard → checks login
 */
function AuthGuard({ children }) {
  const token = localStorage.getItem('smartiv_token');
  return token ? children : <Navigate to="/login" replace />;
}

/**
 * Plan Guard → checks if user has premium access
 */
function PlanGuard({ children }) {
  const plan = localStorage.getItem('plan') || 'basic';

  if (plan === 'premium') {
    return children;
  }

  // If basic user tries to access premium feature
  return <Navigate to="/dashboard" replace />;
}

/**
 * Root redirect
 */
function RootRedirect() {
  const token = localStorage.getItem('smartiv_token');

  if (token) return <Navigate to="/dashboard" replace />;

  window.location.replace('/site/');
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <Routes>

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RootRedirect />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />

          <Route path="/patients" element={
            <AuthGuard>
              <Patients />
            </AuthGuard>
          } />

          <Route path="/patient/:id" element={
            <AuthGuard>
              <PatientDetail />
            </AuthGuard>
          } />

          {/* PREMIUM ONLY FEATURES */}
          <Route path="/alerts" element={
            <AuthGuard>
              <PlanGuard>
                <Alerts />
              </PlanGuard>
            </AuthGuard>
          } />

          <Route path="/logs" element={
            <AuthGuard>
              <PlanGuard>
                <Logs />
              </PlanGuard>
            </AuthGuard>
          } />

          <Route path="/settings" element={
            <AuthGuard>
              <PlanGuard>
                <Settings />
              </PlanGuard>
            </AuthGuard>
          } />

          {/* Fallback */}
          <Route path="*" element={
            <AuthGuard>
              <Navigate to="/dashboard" replace />
            </AuthGuard>
          } />

        </Routes>
      </SocketProvider>
    </BrowserRouter>
  );
}

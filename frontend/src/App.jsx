import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientDetail from './pages/PatientDetail';
import Patients from './pages/Patients';
import Alerts from './pages/Alerts';
import Logs from './pages/Logs';
import Settings from './pages/Settings';

function AuthGuard({ children }) {
  const token = localStorage.getItem('smartiv_token');
  return token ? children : <Navigate to="/login" replace />;
}

function RootRedirect() {
  const token = localStorage.getItem('smartiv_token');
  // If logged in, go to dashboard; otherwise go to the marketing site
  if (token) return <Navigate to="/dashboard" replace />;
  // /site/ is served statically from public/site/index.html
  window.location.replace('/site/');
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RootRedirect />} />
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/patients" element={<AuthGuard><Patients /></AuthGuard>} />
          <Route path="/patient/:id" element={<AuthGuard><PatientDetail /></AuthGuard>} />
          <Route path="/alerts" element={<AuthGuard><Alerts /></AuthGuard>} />
          <Route path="/logs" element={<AuthGuard><Logs /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
          <Route path="*" element={<AuthGuard><Navigate to="/dashboard" replace /></AuthGuard>} />
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  );
}

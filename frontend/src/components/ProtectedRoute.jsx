import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

/**
 * staff: clinical dashboard — role staff only
 * patient: family view — staff (any patient) or family (matching patientSlug)
 */
export default function ProtectedRoute({ children, variant = 'staff', patientSlug }) {
  const { isAuthenticated, user } = useAuth();
  const loc = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  }

  if (variant === 'staff' && user?.role !== 'staff') {
    const slug = user?.patientSlug || 'rahul-sharma';
    return <Navigate to={`/patient/${slug}`} replace />;
  }

  if (variant === 'patient' && user?.role === 'family' && patientSlug && user.patientSlug !== patientSlug) {
    return <Navigate to={`/patient/${user.patientSlug}`} replace />;
  }

  return children;
}

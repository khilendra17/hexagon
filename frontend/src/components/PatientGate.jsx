import { useParams } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import PatientLayout from './PatientLayout.jsx';

export default function PatientGate() {
  const { patientId } = useParams();
  return (
    <ProtectedRoute variant="patient" patientSlug={patientId}>
      <PatientLayout />
    </ProtectedRoute>
  );
}

/**
 * ConsentModal.jsx
 * Research data sharing consent overlay.
 * Shows anonymised JSON preview before enabling research sharing.
 */
import { useState } from 'react';

function AnonymisedPreview({ session }) {
  if (!session) return null;
  const anon = {
    patientId: '[ANONYMISED]',
    patientName: '[ANONYMISED]',
    bedNumber: '[ANONYMISED]',
    bottleNumber: session.bottleNumber,
    status: session.status,
    startTime: session.startTime,
    endTime: session.endTime,
    drug: session.drug ? {
      name: session.drug.name,
      dosageMg: session.drug.dosageMg,
      injectedBy: '[ANONYMISED]',
    } : null,
    drugResponse: session.drugResponse,
    vitalsCount: session.vitalsTimeline?.length ?? 0,
  };
  return (
    <pre className="consent-json-preview">
      {JSON.stringify(anon, null, 2)}
    </pre>
  );
}

export default function ConsentModal({ session, onAccept, onCancel }) {
  const [preview, setPreview] = useState(false);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Enable Research Sharing?</div>
        <div className="modal-body">
          <p>Your data will be <strong>fully anonymised</strong> before being shared with research teams. All personal information (name, bed number, doctor name) is removed.</p>
          <p>Only de-identified treatment metrics (drug name, dosage, efficacy score, vitals timeline) are shared.</p>
          <button className="btn-text" onClick={() => setPreview(!preview)}>
            {preview ? 'Hide' : 'View'} What Data Is Shared ↓
          </button>
          {preview && <AnonymisedPreview session={session} />}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={onAccept}>I Agree — Enable Sharing</button>
        </div>
      </div>
    </div>
  );
}

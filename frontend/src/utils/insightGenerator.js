/**
 * insightGenerator.js
 * Plain-English summaries for the patient/family view.
 * No medical jargon.
 */

/** Overall status for patient home badge */
export function getOverallStatus(vitals) {
  if (!vitals) return { label: 'Checking...', level: 'normal' };
  const { heartRate: hr, spo2 } = vitals;
  if (hr > 120 || hr < 50 || spo2 < 92) return { label: 'Needs Attention', level: 'critical' };
  if (hr > 100 || hr < 60 || spo2 < 95) return { label: 'Under Observation', level: 'warning' };
  return { label: 'Resting Comfortably', level: 'normal' };
}

/** Heart rate plain-English label */
export function hrLabel(hr) {
  if (!hr) return { text: 'Checking...', level: 'normal' };
  if (hr < 50 || hr > 120) return { text: 'Needs Attention', level: 'critical' };
  if (hr <= 60) return { text: 'Slightly Slow', level: 'warning' };
  if (hr > 100) return { text: 'Beating Fast', level: 'warning' };
  return { text: 'Beating Normally', level: 'normal' };
}

/** SpO2 plain-English label */
export function spo2Label(spo2) {
  if (!spo2) return { text: 'Checking...', level: 'normal' };
  if (spo2 < 92) return { text: 'Low — Doctor Notified', level: 'critical' };
  if (spo2 < 95) return { text: 'Slightly Low', level: 'warning' };
  return { text: 'Breathing Well', level: 'normal' };
}

/** Efficacy score → plain-English drug response text */
export function efficacyText(score) {
  if (score == null) return null;
  if (score >= 70) return 'Body responded well to the medication';
  if (score >= 40) return 'Response took a little longer than usual';
  return 'Doctor is monitoring the response';
}

/** Efficacy score → star rating label */
export function starRating(score) {
  if (score == null) return { label: 'No data', stars: 0, level: 'normal' };
  if (score >= 80) return { label: 'Worked Very Well', stars: 5, level: 'positive' };
  if (score >= 60) return { label: 'Worked Well', stars: 4, level: 'positive' };
  if (score >= 40) return { label: 'Partially Effective', stars: 3, level: 'warning' };
  return { label: 'Doctor Monitoring Response', stars: 2, level: 'critical' };
}

/** Efficacy color class helper */
export function efficacyColor(score) {
  if (score >= 70) return 'positive-green';
  if (score >= 40) return 'warn-amber';
  return 'alert-red';
}

/** Auto-generate plain-English summary paragraph for BottleReport */
export function generateBottleSummary(session) {
  if (!session) return '';
  const { patientName = 'The patient', vitalsTimeline = [], drug, drugResponse } = session;
  const hrs = vitalsTimeline.map((v) => v.heartRate).filter(Boolean);
  const spo2s = vitalsTimeline.map((v) => v.spo2).filter(Boolean);
  if (!hrs.length) return `${patientName}'s vitals during this bottle are not yet available.`;

  const hrMin = Math.round(Math.min(...hrs));
  const hrMax = Math.round(Math.max(...hrs));
  const avgSpo2 = (spo2s.reduce((a, b) => a + b, 0) / spo2s.length).toFixed(1);
  const hrDesc = hrMax <= 100 ? 'normal' : 'slightly elevated';
  const spo2Desc = avgSpo2 >= 95 ? 'above' : 'around';

  let suffix = '';
  if (drug?.name && drugResponse?.responseOnsetMinutes != null) {
    const t = drug.injectedAt ? new Date(drug.injectedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'the recorded time';
    const improved = drugResponse.peakEfficacyPercent > 0 ? 'improved' : 'did not change significantly';
    suffix = ` After the medication was added at ${t}, oxygen levels ${improved} within about ${Math.round(drugResponse.responseOnsetMinutes)} minutes.`;
  } else if (!drug?.name) {
    suffix = ' This was a plain saline bottle — no medication was added.';
  }

  return `During this bottle, ${patientName}'s heart rate stayed between ${hrMin} and ${hrMax} beats per minute, which is ${hrDesc}. Blood oxygen stayed ${spo2Desc} ${avgSpo2}% throughout.${suffix}`;
}

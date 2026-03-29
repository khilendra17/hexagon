/**
 * Drug Response Calculator
 * Called when a bottle session ends.
 * Computes efficacy metrics from vitalsTimeline + drug.injectedAt
 */

export function compute(session) {
  const { vitalsTimeline, drug } = session;

  if (!drug || !drug.injectedAt || !vitalsTimeline || vitalsTimeline.length < 2) {
    return null;
  }

  const injectedAt = new Date(drug.injectedAt).getTime();

  // Split timeline: pre-drug vs post-drug
  const preDrug  = vitalsTimeline.filter(v => new Date(v.timestamp).getTime() < injectedAt);
  const postDrug = vitalsTimeline.filter(v => new Date(v.timestamp).getTime() >= injectedAt);

  if (preDrug.length === 0 || postDrug.length === 0) return null;

  // Pre-drug baseline average SpO₂
  const baselineAvg = preDrug.reduce((s, v) => s + v.spo2, 0) / preDrug.length;

  // Response onset: first post-drug reading where SpO₂ ≥ baseline + 0.5%
  let responseOnsetMinutes = null;
  for (const entry of postDrug) {
    if (entry.spo2 >= baselineAvg + 0.5) {
      responseOnsetMinutes = Math.round(
        ((new Date(entry.timestamp).getTime() - injectedAt) / 60000) * 10
      ) / 10;
      break;
    }
  }

  // Peak efficacy: max SpO₂ improvement % over baseline
  const peakSpo2 = Math.max(...postDrug.map(v => v.spo2));
  const peakEfficacyPercent = Math.round((peakSpo2 - baselineAvg) * 100) / 100;

  // Duration: how long SpO₂ stayed ≥ baseline + 0.5%
  const respondingPoints = postDrug.filter(v => v.spo2 >= baselineAvg + 0.5);
  let durationMinutes = 0;
  if (respondingPoints.length >= 2) {
    const first = new Date(respondingPoints[0].timestamp).getTime();
    const last  = new Date(respondingPoints[respondingPoints.length - 1].timestamp).getTime();
    durationMinutes = Math.round(((last - first) / 60000) * 10) / 10;
  }

  // Efficacy score (0-100)
  const onset = responseOnsetMinutes !== null ? responseOnsetMinutes : 15;
  const rawScore =
    (peakEfficacyPercent * 40) +
    (Math.min(onset, 15) / 15 * 30) +
    (Math.min(durationMinutes, 60) / 60 * 30);

  const efficacyScore = Math.round(Math.min(100, rawScore) * 10) / 10;

  // Response status
  let responseStatus;
  if (efficacyScore >= 70)      responseStatus = 'Effective';
  else if (efficacyScore >= 40) responseStatus = 'Partial';
  else                          responseStatus = 'No Response';

  return { responseOnsetMinutes, peakEfficacyPercent, durationMinutes, efficacyScore, responseStatus };
}

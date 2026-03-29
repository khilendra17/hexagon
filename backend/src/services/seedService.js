/**
 * Seed Service
 * Seeds BottleSession collection on startup if empty.
 * Patient: Rahul Sharma, Bed 4A, Ward 3B
 */
import BottleSession from '../models/BottleSession.js';

function todayAt(h, m) {
  const d = new Date(); d.setHours(h, m, 0, 0); return d;
}

function genTimeline(startTime, endTime, drugTime, risingFrom, risingTo, riseStartMins) {
  const entries = [];
  const totalMs = endTime - startTime;
  const steps = 70;
  for (let i = 0; i < steps; i++) {
    const ts = new Date(startTime.getTime() + (totalMs / steps) * i);
    const mins = (ts - startTime) / 60000;
    const drugMins = drugTime ? (ts - drugTime) / 60000 : -1;
    let spo2;
    if (!drugTime || drugMins < riseStartMins) {
      spo2 = risingFrom + (Math.random() - 0.5) * 0.3;
    } else {
      const progress = Math.min(1, (drugMins - riseStartMins) / 20);
      spo2 = risingFrom + (risingTo - risingFrom) * progress + (Math.random() - 0.5) * 0.25;
    }
    entries.push({ timestamp: ts, heartRate: 75 + (Math.random() - 0.5) * 10, spo2: +spo2.toFixed(2) });
  }
  return entries;
}

export async function seedBottleSessions() {
  try {
    const count = await BottleSession.countDocuments();
    if (count > 0) { console.log('BottleSession seed: already seeded, skipping.'); return; }

    const patientBase = { patientId: 'rahul-sharma', patientName: 'Rahul Sharma', bedNumber: 'Bed 4A' };

    const start1 = todayAt(8, 0), end1 = todayAt(11, 30), drug1 = todayAt(9, 15);
    const s1vt = genTimeline(start1, end1, drug1, 96, 98.5, 8);

    const start2 = todayAt(12, 0), end2 = todayAt(15, 30), drug2 = todayAt(13, 0);
    const s2vt = genTimeline(start2, end2, drug2, 95.5, 97.5, 12);

    await BottleSession.create([
      {
        ...patientBase, bottleNumber: 1, date: todayAt(0,0),
        startTime: start1, endTime: end1, status: 'completed', volumeMl: 500,
        drug: { name: 'Paracetamol', dosageMg: 500, injectedAt: drug1, injectedBy: 'Dr. Anjali Mehta' },
        drugResponse: { responseOnsetMinutes: 8.0, peakEfficacyPercent: 87.0, durationMinutes: 42.0, efficacyScore: 84.0, responseStatus: 'Effective' },
        vitalsTimeline: s1vt,
        doctorNotes: 'Patient responded well. Continue same dosage.',
        exportFlags: { sharedWithFamily: true, sharedWithResearch: false, sharedWithPharmacy: false },
      },
      {
        ...patientBase, bottleNumber: 2, date: todayAt(0,0),
        startTime: start2, endTime: end2, status: 'completed', volumeMl: 500,
        drug: { name: 'Ondansetron', dosageMg: 4, injectedAt: drug2, injectedBy: 'Dr. Anjali Mehta' },
        drugResponse: { responseOnsetMinutes: 12.0, peakEfficacyPercent: 71.0, durationMinutes: 55.0, efficacyScore: 73.0, responseStatus: 'Effective' },
        vitalsTimeline: s2vt,
        doctorNotes: 'Slight delay in response. Monitor next dose.',
        exportFlags: { sharedWithFamily: true, sharedWithResearch: false, sharedWithPharmacy: false },
      },
      {
        ...patientBase, bottleNumber: 3, date: todayAt(0,0),
        startTime: todayAt(16, 0), endTime: null, status: 'ongoing', volumeMl: 500,
        drug: { name: null }, vitalsTimeline: [], drugResponse: null, doctorNotes: null,
        exportFlags: { sharedWithFamily: true, sharedWithResearch: false, sharedWithPharmacy: false },
      },
    ]);
    console.log('BottleSession seed: 3 sessions created for Rahul Sharma.');
  } catch (err) {
    console.warn('BottleSession seed failed (non-fatal):', err.message);
  }
}

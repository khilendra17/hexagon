/**
 * Session Controller
 * All bottle session CRUD operations.
 * In-memory fallback when MongoDB unavailable.
 */
import mongoose from 'mongoose';
import BottleSession from '../models/BottleSession.js';
import { compute } from '../services/drugResponseCalculator.js';
import { emitSessionUpdate } from '../sockets/index.js';

// In-memory fallback store (exported so sessionDetailController can share it)
export const _memSessions = [];

function isMongo() { return mongoose.connection.readyState === 1; }

function today() {
  const d = new Date(); d.setHours(0,0,0,0); return d;
}

// POST /api/sessions/start
export async function startSession(req, res) {
  try {
    const { patientId, patientName, bedNumber, bottleNumber, volumeMl } = req.body;
    if (!patientId || !patientName || !bedNumber || bottleNumber == null)
      return res.status(422).json({ success: false, message: 'patientId, patientName, bedNumber, bottleNumber required' });

    const data = { patientId, patientName, bedNumber, bottleNumber,
      date: today(), startTime: new Date(), volumeMl: volumeMl || 500 };

    if (!isMongo()) {
      const session = { _id: `mem_${Date.now()}`, ...data, status: 'ongoing',
        endTime: null, drug: {}, vitalsTimeline: [], drugResponse: null, doctorNotes: null,
        exportFlags: { sharedWithFamily: true, sharedWithResearch: false, sharedWithPharmacy: false } };
      _memSessions.push(session);
      return res.status(201).json({ success: true, data: session });
    }
    const session = await BottleSession.create(data);
    res.status(201).json({ success: true, data: session });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
}

// POST /api/sessions/:sessionId/inject-drug
export async function injectDrug(req, res) {
  try {
    const { sessionId } = req.params;
    const { name, dosageMg, injectedBy } = req.body;
    const drug = { name, dosageMg, injectedAt: new Date(), injectedBy };

    if (!isMongo()) {
      const s = _memSessions.find(s => s._id === sessionId);
      if (!s) return res.status(404).json({ success: false, message: 'Session not found' });
      s.drug = drug;
      return res.json({ success: true, data: s });
    }
    const session = await BottleSession.findByIdAndUpdate(sessionId, { drug }, { new: true });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
}

// POST /api/sessions/:sessionId/end
export async function endSession(req, res) {
  try {
    const { sessionId } = req.params;
    if (!isMongo()) {
      const s = _memSessions.find(s => s._id === sessionId);
      if (!s) return res.status(404).json({ success: false, message: 'Session not found' });
      s.endTime = new Date(); s.status = 'completed';
      s.drugResponse = compute(s);
      return res.json({ success: true, data: s });
    }
    const session = await BottleSession.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    session.endTime = new Date(); session.status = 'completed';
    session.drugResponse = compute(session.toObject());
    await session.save();
    res.json({ success: true, data: session });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
}

// GET /api/sessions/:patientId
export async function getSessions(req, res) {
  try {
    const { patientId } = req.params;
    const { date, status } = req.query;
    if (!isMongo()) {
      let s = _memSessions.filter(s => s.patientId === patientId);
      if (status) s = s.filter(x => x.status === status);
      return res.json({ success: true, data: s });
    }
    const filter = { patientId };
    if (status) filter.status = status;
    if (date) { const d = new Date(date); const next = new Date(d); next.setDate(next.getDate()+1);
      filter.date = { $gte: d, $lt: next }; }
    const sessions = await BottleSession.find(filter).sort({ startTime: 1 });
    res.json({ success: true, data: sessions });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
}

// GET /api/sessions/:patientId/today
export async function getTodaySessions(req, res) {
  try {
    const { patientId } = req.params;
    if (!isMongo()) {
      const todayStart = today().getTime();
      const s = _memSessions.filter(s => s.patientId === patientId &&
        new Date(s.startTime).getTime() >= todayStart);
      return res.json({ success: true, data: s });
    }
    const t = today(); const next = new Date(t); next.setDate(next.getDate()+1);
    const sessions = await BottleSession.find({ patientId, date: { $gte: t, $lt: next } }).sort({ startTime: 1 });
    res.json({ success: true, data: sessions });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
}

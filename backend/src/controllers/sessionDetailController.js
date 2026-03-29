/**
 * Session Controller — Part 2
 * Detail, notes, export, export-flags endpoints.
 * Lives separately to keep files under 150 lines (PRD NFR-M06).
 */
import mongoose from 'mongoose';
import BottleSession from '../models/BottleSession.js';
import { _memSessions } from './sessionController.js';

function isMongo() { return mongoose.connection.readyState === 1; }

// GET /api/sessions/:sessionId/detail
export async function getSessionDetail(req, res) {
  try {
    const { sessionId } = req.params;
    if (!isMongo()) {
      const session = _memSessions.find((s) => s._id === sessionId);
      if (!session) return res.status(404).json({ success: false, message: 'Not found' });
      return res.json({ success: true, data: session });
    }
    const session = await BottleSession.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: session });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
}

// PUT /api/sessions/:sessionId/notes
export async function updateNotes(req, res) {
  try {
    const { sessionId } = req.params;
    const { doctorNotes } = req.body;
    if (!isMongo()) {
      const s = _memSessions.find((s) => s._id === sessionId);
      if (!s) return res.status(404).json({ success: false, message: 'Not found' });
      s.doctorNotes = doctorNotes;
      return res.json({ success: true, data: s });
    }
    const session = await BottleSession.findByIdAndUpdate(sessionId, { doctorNotes }, { new: true });
    if (!session) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: session });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
}

// GET /api/sessions/:sessionId/export
export async function exportSession(req, res) {
  try {
    const { sessionId } = req.params;
    const { format = 'json' } = req.query;

    let rawSession = null;
    if (!isMongo()) {
      rawSession = _memSessions.find((s) => s._id === sessionId);
      if (!rawSession) return res.status(404).json({ success: false, message: 'Not found' });
    } else {
      const doc = await BottleSession.findById(sessionId);
      if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
      rawSession = doc.toObject();
    }

    // Anonymise
    const anon = { ...rawSession };
    anon.patientName = '[ANONYMISED]'; anon.patientId = '[ANONYMISED]';
    anon.bedNumber = '[ANONYMISED]';
    if (anon.drug) anon.drug = { ...anon.drug, injectedBy: '[ANONYMISED]' };
    anon.doctorNotes = null;

    if (format === 'csv') {
      const rows = [
        ['bottleNumber','status','startTime','endTime','drugName','dosageMg','efficacyScore','responseStatus'],
        [anon.bottleNumber, anon.status, anon.startTime, anon.endTime,
         anon.drug?.name || '', anon.drug?.dosageMg || '',
         anon.drugResponse?.efficacyScore || '', anon.drugResponse?.responseStatus || ''],
      ];
      res.setHeader('Content-Type', 'text/csv');
      return res.send(rows.map((r) => r.join(',')).join('\n'));
    }
    res.json({ success: true, data: anon });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
}

// PUT /api/sessions/:sessionId/export-flags
export async function updateExportFlags(req, res) {
  try {
    const { sessionId } = req.params;
    const flags = req.body;
    if (!isMongo()) {
      const s = _memSessions.find((s) => s._id === sessionId);
      if (!s) return res.status(404).json({ success: false, message: 'Not found' });
      s.exportFlags = { ...s.exportFlags, ...flags };
      return res.json({ success: true, data: s });
    }
    const session = await BottleSession.findByIdAndUpdate(
      sessionId,
      { exportFlags: flags },
      { new: true }
    );
    if (!session) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: session });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
}

import { Router } from 'express';
import {
  startSession, injectDrug, endSession,
  getSessions, getTodaySessions,
} from '../controllers/sessionController.js';
import {
  getSessionDetail, updateNotes, exportSession, updateExportFlags,
} from '../controllers/sessionDetailController.js';

const router = Router();

// POST /api/sessions/start
router.post('/start', startSession);

// POST /api/sessions/:sessionId/inject-drug
router.post('/:sessionId/inject-drug', injectDrug);

// POST /api/sessions/:sessionId/end
router.post('/:sessionId/end', endSession);

// GET /api/sessions/:patientId (must come after named routes)
router.get('/:patientId/today', getTodaySessions);
router.get('/:patientId', getSessions);

// GET /api/sessions/:sessionId/detail
router.get('/:sessionId/detail', getSessionDetail);

// PUT /api/sessions/:sessionId/notes
router.put('/:sessionId/notes', updateNotes);

// GET /api/sessions/:sessionId/export
router.get('/:sessionId/export', exportSession);

// PUT /api/sessions/:sessionId/export-flags
router.put('/:sessionId/export-flags', updateExportFlags);

export default router;

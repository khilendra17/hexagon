/**
 * AI Proxy Controller
 * Proxies POST /api/analyze-frame to the Python AI service.
 * Never crashes on AI service failure (PRD NFR-R01).
 * Never exposes AI_SERVICE_URL to frontend.
 */
import axios from 'axios';
import FormData from 'form-data';
import { emitIVVision } from '../sockets/index.js';

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const TIMEOUT = 5000;

export async function analyzeFrame(req, res) {
  const io = req.app.locals.io;

  if (!req.file) {
    return res.status(422).json({ success: false, message: 'Field "frame" (image file) is required.' });
  }

  try {
    const form = new FormData();
    form.append('frame', req.file.buffer, {
      filename: req.file.originalname || 'frame.jpg',
      contentType: req.file.mimetype || 'image/jpeg',
    });

    const response = await axios.post(`${AI_URL}/analyze-frame`, form, {
      headers: form.getHeaders(),
      timeout: TIMEOUT,
    });

    const data = response.data;
    emitIVVision(io, { status: data.status });
    return res.json({ success: true, data });

  } catch (err) {
    // AI service offline or timed out — return graceful fallback (PRD NFR-R01)
    console.warn('AI service unavailable:', err.message);
    const fallback = { status: 'error', message: 'Vision service unavailable' };
    emitIVVision(io, { status: 'error' });
    return res.json({ success: true, data: fallback });
  }
}

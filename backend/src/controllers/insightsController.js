/**
 * Insights Controller
 * Returns latest Drug Impact Curve result from memory.
 * Format per PRD Section 11.2.
 */
import { getLatestInsight } from '../services/drugCurveService.js';

export function getInsights(req, res) {
  const insight = getLatestInsight();
  if (!insight) {
    return res.json({
      success: true,
      data: null,
      message: 'No IV event recorded in this session.',
    });
  }
  res.json({ success: true, data: insight });
}

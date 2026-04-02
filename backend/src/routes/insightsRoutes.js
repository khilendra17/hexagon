import express from "express";
import {
  getLastInsight,
  getLatestInsightAcrossPatients,
} from "../services/drugCurveService.js";
import authRequired from "../middleware/authRequired.js";

const router = express.Router();

router.get("/", authRequired, (req, res) => {
  const { role, userId } = req.auth;

  if (role === "patient") {
    return res.json({ success: true, data: getLastInsight(userId) });
  }

  const patientId = req.query.patientId;
  // doctor: if patientId not provided, return the latest computed insight across any patient
  if (!patientId) {
    return res.json({ success: true, data: getLatestInsightAcrossPatients() });
  }

  return res.json({ success: true, data: getLastInsight(patientId) });
});

export default router;

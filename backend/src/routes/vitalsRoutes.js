import express from "express";
import {
  createVitals,
  getLatestVitals,
  getVitalsHistory,
} from "../controllers/vitalsController.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const vitals = await createVitals(req);
    res.status(201).json({ success: true, data: vitals });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/latest", async (_req, res) => {
  try {
    const latest = await getLatestVitals();
    res.json({ success: true, data: latest });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/history", async (req, res) => {
  try {
    const history = await getVitalsHistory(req.query.limit);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

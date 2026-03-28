import express from "express";
import { createAlert, listAlerts } from "../controllers/alertController.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const alert = await createAlert(req);
    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const alerts = await listAlerts();
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

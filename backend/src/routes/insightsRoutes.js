import express from "express";
import { getLastInsight } from "../services/drugCurveService.js";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ success: true, data: getLastInsight() });
});

export default router;

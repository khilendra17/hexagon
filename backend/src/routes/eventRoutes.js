import express from "express";
import {
  createEvent,
  scheduleDrugCurveCompute,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const event = await createEvent(req.body);
    res.status(201).json({ success: true, data: event });
    scheduleDrugCurveCompute(event, req.app.locals.io);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;

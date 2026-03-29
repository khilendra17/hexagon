import crypto from "crypto";
import Alert from "../models/Alert.js";
import { emitAlertNew } from "../sockets/index.js";

const BUCKET_MS = 300_000;

function alertHash(alertType, timeBucket) {
  return crypto
    .createHash("sha256")
    .update(`${alertType}${timeBucket}`)
    .digest("hex");
}

async function persistIfNew({ alertType, severity, message, io, timeBucket }) {
  const hash = alertHash(alertType, timeBucket);
  const exists = await Alert.findOne({ hash });
  if (exists) return;

  try {
    const alert = await Alert.create({
      type: alertType,
      message,
      severity,
      hash,
    });
    emitAlertNew(io, alert);
  } catch (err) {
    if (err.code === 11000) return;
    throw err;
  }
}

export async function evaluate(vitals, io) {
  const timeBucket = Math.floor(Date.now() / BUCKET_MS);
  const hr = vitals.heartRate;
  const spo2 = vitals.spo2;
  const { ivStatus } = vitals;

  if (typeof spo2 === "number") {
    if (spo2 < 90) {
      await persistIfNew({
        alertType: "LOW_SPO2_CRITICAL",
        severity: "critical",
        message: `Critical: SpO₂ has dropped to ${spo2}%. Immediate assessment required.`,
        io,
        timeBucket,
      });
    } else if (spo2 < 94) {
      await persistIfNew({
        alertType: "LOW_SPO2_WARNING",
        severity: "warning",
        message: `Warning: SpO₂ is ${spo2}%, below normal range. Monitor closely.`,
        io,
        timeBucket,
      });
    }
  }

  if (typeof hr === "number") {
    if (hr > 120) {
      await persistIfNew({
        alertType: "HIGH_HR",
        severity: "warning",
        message: `Warning: Tachycardia detected. Heart rate is ${hr} bpm.`,
        io,
        timeBucket,
      });
    } else if (hr < 50) {
      await persistIfNew({
        alertType: "LOW_HR",
        severity: "warning",
        message: `Warning: Bradycardia detected. Heart rate is ${hr} bpm.`,
        io,
        timeBucket,
      });
    }
  }

  if (ivStatus === "stopped") {
    await persistIfNew({
      alertType: "IV_STOPPED",
      severity: "info",
      message:
        "IV administration has stopped. Monitor patient for response changes.",
      io,
      timeBucket,
    });
  }
}

import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import { setupSockets } from "./sockets/index.js";
import vitalsRoutes from "./routes/vitalsRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import insightsRoutes from "./routes/insightsRoutes.js";
import analyzeFrameRoutes from "./routes/analyzeFrameRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import patientsRoutes from "./routes/patientsRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import nodeRoutes from "./routes/nodeRoutes.js";
import startMockNodeCollector from "./mock/startMockNodeCollector.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
function validateRequiredEnv() {
  const required = (name) => {
    const val = process.env[name];
    if (!val || !String(val).trim()) {
      throw new Error(`${name} is not set`);
    }
    return val;
  };

  const parseCorsOrigins = (value) => {
    // Keep this strict to avoid accidental wildcard CORS.
    if (!value) throw new Error("SOCKET_CORS_ORIGIN is not set");
    if (String(value).includes("*")) {
      throw new Error("SOCKET_CORS_ORIGIN must not contain '*'");
    }
    const origins = String(value)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!origins.length) throw new Error("SOCKET_CORS_ORIGIN has no valid origins");
    return origins;
  };

  // Required env vars (as per PRD).
  required("AI_SERVICE_URL");
  required("SOCKET_CORS_ORIGIN");
  required("JWT_SECRET");

  // MONGO_URI may be called MONGODB_URI in some older setups; accept either.
  if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
    throw new Error("MONGO_URI is not set (or MONGODB_URI fallback missing)");
  }

  const portRaw = required("PORT");
  const port = Number(portRaw);
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error(`PORT must be a valid positive number, got: ${portRaw}`);
  }

  return { port, corsOrigins: parseCorsOrigins(process.env.SOCKET_CORS_ORIGIN) };
}

let port;
let corsOrigins;
try {
  ({ port, corsOrigins } = validateRequiredEnv());
} catch (err) {
  console.error("Backend env validation failed:", err?.message || String(err));
  process.exit(1);
}

setupSockets(server, app);

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/vitals", vitalsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/analyze-frame", analyzeFrameRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/nodes", nodeRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/patient", patientRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "backend" });
});

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
    // Demo/test-only: periodically generates mock data from DeviceNode assignments.
    startMockNodeCollector(app.locals.io);
  })
  .catch((error) => {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  });

import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import { setupSockets } from "./sockets/index.js";
import vitalsRoutes from "./routes/vitalsRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;

setupSockets(server, app);

app.use(cors());
app.use(express.json());
app.use("/api/vitals", vitalsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/alerts", alertRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "backend" });
});

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  });

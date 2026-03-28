import mongoose from "mongoose";

const vitalsSchema = new mongoose.Schema(
  {
    heartRate: { type: Number, required: true },
    spo2: { type: Number, required: true },
    ivStatus: { type: String, enum: ["running", "stopped"], required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("Vitals", vitalsSchema);

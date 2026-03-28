import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    message: { type: String, required: true },
    severity: {
      type: String,
      enum: ["info", "warning", "critical"],
      required: true,
    },
    acknowledged: { type: Boolean, default: false },
    hash: { type: String, unique: true },
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("Alert", alertSchema);

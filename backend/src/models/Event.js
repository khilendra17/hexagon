import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["iv_start", "iv_stop"], required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: Object, default: {} },
  },
  { versionKey: false }
);

export default mongoose.model("Event", eventSchema);

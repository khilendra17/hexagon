import mongoose from 'mongoose';

const vitalsEntrySchema = new mongoose.Schema({
  timestamp: Date,
  heartRate: Number,
  spo2: Number,
}, { _id: false });

const drugSchema = new mongoose.Schema({
  name:       { type: String, default: null },
  dosageMg:   Number,
  injectedAt: Date,
  injectedBy: String,
}, { _id: false });

const drugResponseSchema = new mongoose.Schema({
  responseOnsetMinutes: Number,
  peakEfficacyPercent:  Number,
  durationMinutes:      Number,
  efficacyScore:        Number,
  responseStatus:       { type: String, enum: ['Effective', 'Partial', 'No Response'] },
}, { _id: false });

const exportFlagsSchema = new mongoose.Schema({
  sharedWithFamily:   { type: Boolean, default: true },
  sharedWithResearch: { type: Boolean, default: false },
  sharedWithPharmacy: { type: Boolean, default: false },
}, { _id: false });

const bottleSessionSchema = new mongoose.Schema({
  patientId:      { type: String, required: true },
  patientName:    { type: String, required: true },
  bedNumber:      { type: String, required: true },
  bottleNumber:   { type: Number, required: true },
  date:           { type: Date, required: true },
  startTime:      { type: Date, required: true },
  endTime:        { type: Date, default: null },
  status:         { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  volumeMl:       { type: Number, default: 500 },
  drug:           { type: drugSchema, default: () => ({}) },
  vitalsTimeline: { type: [vitalsEntrySchema], default: [] },
  drugResponse:   { type: drugResponseSchema, default: null },
  doctorNotes:    { type: String, default: null },
  exportFlags:    { type: exportFlagsSchema, default: () => ({}) },
  createdAt:      { type: Date, default: Date.now },
});

bottleSessionSchema.index({ patientId: 1, date: -1 });
bottleSessionSchema.index({ status: 1 });

export default mongoose.model('BottleSession', bottleSessionSchema);

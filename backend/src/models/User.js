import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['staff', 'family'], required: true },
    patientSlug: { type: String, trim: true, default: null },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model('User', userSchema);

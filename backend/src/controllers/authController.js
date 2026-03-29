import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { signUserToken } from '../services/authTokenService.js';
import { getPatientById } from './patientController.js';

const _memUsers = [];
const SALT = 10;

function mongoOk() {
  return mongoose.connection.readyState === 1;
}

async function findPatientSlugExists(slug) {
  if (!slug) return false;
  const p = await getPatientById(String(slug).trim());
  return !!p;
}

export async function register(req, res) {
  try {
    const { email, password, name, role, patientSlug } = req.body;
    if (!email || !password || !name || !role) {
      return res.status(400).json({ success: false, error: 'email, password, name, and role are required' });
    }
    if (!['staff', 'family'].includes(role)) {
      return res.status(400).json({ success: false, error: 'role must be staff or family' });
    }
    if (role === 'family' && !patientSlug) {
      return res.status(400).json({ success: false, error: 'family accounts require patientSlug (patient link code)' });
    }
    if (role === 'family' && !(await findPatientSlugExists(patientSlug))) {
      return res.status(400).json({ success: false, error: 'Unknown patient link code' });
    }

    const passwordHash = await bcrypt.hash(password, SALT);
    const emailLower = email.toLowerCase();

    if (mongoOk()) {
      const exists = await User.findOne({ email: emailLower });
      if (exists) return res.status(409).json({ success: false, error: 'Email already registered' });
      const user = await User.create({
        email: emailLower,
        passwordHash,
        name: String(name).trim(),
        role,
        patientSlug: role === 'family' ? String(patientSlug).trim() : null,
      });
      return respondAuth(res, user);
    }

    if (_memUsers.some((u) => u.email === emailLower)) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }
    const user = {
      _id: `mu_${Date.now()}`,
      email: emailLower,
      passwordHash,
      name: String(name).trim(),
      role,
      patientSlug: role === 'family' ? String(patientSlug).trim() : null,
    };
    _memUsers.push(user);
    return respondAuth(res, user);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'email and password required' });
    }
    const emailLower = email.toLowerCase();
    let user = null;
    if (mongoOk()) {
      user = await User.findOne({ email: emailLower });
    } else {
      user = _memUsers.find((u) => u.email === emailLower);
    }
    if (!user) return res.status(401).json({ success: false, error: 'Invalid email or password' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ success: false, error: 'Invalid email or password' });
    return respondAuth(res, user);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

function userPayload(user) {
  const id = user._id?.toString?.() || user._id;
  return {
    id,
    email: user.email,
    name: user.name,
    role: user.role,
    patientSlug: user.patientSlug || null,
  };
}

function respondAuth(res, user) {
  const payload = userPayload(user);
  const token = signUserToken({
    sub: payload.id,
    email: payload.email,
    role: payload.role,
    patientSlug: payload.patientSlug,
  });
  res.json({ success: true, token, user: payload });
}

export async function seedAuthUsers() {
  const demoPass = process.env.DEMO_AUTH_PASSWORD || 'demo123';
  const hash = await bcrypt.hash(demoPass, SALT);
  if (mongoOk()) {
    const n = await User.countDocuments();
    if (n > 0) return;
    await User.insertMany([
      { email: 'staff@hospital.local', passwordHash: hash, name: 'Clinical Staff', role: 'staff', patientSlug: null },
      { email: 'family@hospital.local', passwordHash: hash, name: 'Family Member', role: 'family', patientSlug: 'rahul-sharma' },
    ]);
    console.log('Seeded demo users: staff@hospital.local / family@hospital.local (password from DEMO_AUTH_PASSWORD or demo123)');
    return;
  }
  if (_memUsers.length > 0) return;
  _memUsers.push(
    { _id: 'mu_staff', email: 'staff@hospital.local', passwordHash: hash, name: 'Clinical Staff', role: 'staff', patientSlug: null },
    { _id: 'mu_fam', email: 'family@hospital.local', passwordHash: hash, name: 'Family Member', role: 'family', patientSlug: 'rahul-sharma' }
  );
  console.log('Seeded in-memory demo users (Mongo unavailable)');
}

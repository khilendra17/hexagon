import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-only-change-in-production';
const EXPIRES = process.env.JWT_EXPIRES_IN || '8h';

export function signUserToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
}

export function verifyUserToken(token) {
  return jwt.verify(token, SECRET);
}

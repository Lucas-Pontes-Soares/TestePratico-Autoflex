import jwt from 'jsonwebtoken';

interface Payload {
  user_id: string;
  email: string;
}

if(!process.env.JWT_SECRET) {
  throw new Error('DATABASE_URL must be configured.')
}

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(payload: Payload) {
  return jwt.sign({user_id: payload.user_id, email: payload.email}, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
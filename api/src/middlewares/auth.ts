import type { NextFunction } from 'express';
import * as jwt from '../lib/jwt.ts';

export function verifyToken(req: any, res: any, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token must be defined' });
  }

  const [, token] = authHeader.split(' ');

  const decoded = jwt.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.user = decoded; 

  return next();
}
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types/index.js';

/**
 * Middleware that validates the Bearer JWT in the Authorization header.
 * Attaches the decoded `JwtPayload` to `req.user` on success.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

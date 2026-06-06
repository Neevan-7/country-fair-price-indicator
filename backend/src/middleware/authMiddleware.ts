import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@utils/AppError';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    userType: string;
  };
  token?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = (req as Request).headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('No authentication token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    req.user = decoded;
    req.token = token;

    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    if (!allowedRoles.includes(req.user.userType)) {
      throw new UnauthorizedError('Insufficient permissions');
    }

    next();
  };
};

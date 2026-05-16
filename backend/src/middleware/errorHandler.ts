import { Request, Response, NextFunction } from 'express';
import { AppError } from '@utils/AppError';
import logger from '@utils/logger';

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      statusCode: error.statusCode,
      message: error.message,
      ...(error instanceof ValidationError && { errors: (error as any).errors }),
    });
  }

  res.status(500).json({
    success: false,
    statusCode: 500,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : error.message,
  });
};

class ValidationError extends AppError {
  constructor(message: string, public errors: Record<string, string[]>) {
    super(message, 400);
  }
}

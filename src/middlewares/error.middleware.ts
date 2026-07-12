import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

interface IErrorDetail {
  path: string | number;
  message: string;
}

export const globalErrorHandler = (
  err: Error & { statusCode?: number; code?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let errors: IErrorDetail[] = [];

  // Handlers for specific errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((el) => ({
      path: el.path,
      message: el.message,
    }));
  } else if (err.code === 11000) {
    statusCode = 409;
    const key = Object.keys((err as unknown as Record<string, unknown>).keyValue || {})[0] || 'field';
    message = `Duplicate field value entered: ${key}. Please use another value!`;
    errors = [
      {
        path: key,
        message: `${key} already exists`,
      },
    ];
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    errors = [
      {
        path: err.path,
        message: `Invalid value: ${err.value}`,
      },
    ];
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again!';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again!';
  }

  // Debug or development logging
  if (env.NODE_ENV === 'development') {
    console.error('💥 Error object:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 ? { errors } : {}),
    ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

export default globalErrorHandler;

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '../utils/AppError';
import { IAuthUser } from '../types';

export const authorize = (...roles: IAuthUser['role'][]): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(401, 'You are not authenticated.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, `Forbidden: You do not have permission to perform this action. Required: [${roles.join(', ')}]`)
      );
    }

    next();
  };
};

export default authorize;

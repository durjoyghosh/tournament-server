import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { jwtConfig } from '../config/jwt';
import { User } from '../modules/user/user.model';
import { IAuthUser } from '../types';

export const protect = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // 1) Get token from Authorization header or cookie
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError(401, 'You are not logged in! Please log in to get access.'));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, jwtConfig.accessSecret) as jwt.JwtPayload & {
      id: string;
      email: string;
      role: string;
    };

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id).select('+status');
    if (!currentUser) {
      return next(new AppError(401, 'The user belonging to this token no longer exists.'));
    }

    if (currentUser.status === 'inactive' || currentUser.isDeleted) {
      return next(new AppError(401, 'This user account is inactive or deleted.'));
    }

    // 4) Grant access and attach user object
    req.user = {
      id: currentUser.id || currentUser._id.toString(),
      email: currentUser.email,
      role: currentUser.role as IAuthUser['role'],
    };

    next();
  } catch (error) {
    next(new AppError(401, 'Invalid token. Please log in again!'));
  }
};

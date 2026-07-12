import { Request, Response } from 'express';
import { authService } from './auth.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AppError } from '../../utils/AppError';
import { env } from '../../config/env';

// Cookie helper
const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully',
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken || req.cookies?.jwt;

  if (!refreshToken) {
    throw new AppError(400, 'Refresh token is required');
  }

  const result = await authService.refresh(refreshToken);

  setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Token refreshed successfully',
    data: {
      accessToken: result.accessToken,
    },
  });
});

export const logout = catchAsync(async (_req: Request, res: Response) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logged out successfully',
  });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const resetToken = await authService.forgotPassword(req.body.email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password reset token generated successfully. In production, this token would be sent to your email.',
    data: { resetToken },
  });
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  await authService.resetPassword(token, newPassword);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password has been reset successfully',
  });
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const { oldPassword, newPassword } = req.body;
  await authService.changePassword(currentUserId, oldPassword, newPassword);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password updated successfully',
  });
});

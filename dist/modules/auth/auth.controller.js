"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = require("../../utils/AppError");
const env_1 = require("../../config/env");
// Cookie helper
const setRefreshTokenCookie = (res, token) => {
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: env_1.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};
exports.register = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.authService.register(req.body);
    setRefreshTokenCookie(res, result.refreshToken);
    (0, sendResponse_1.default)(res, {
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
exports.login = (0, catchAsync_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const result = await auth_service_1.authService.login(email, password);
    setRefreshTokenCookie(res, result.refreshToken);
    (0, sendResponse_1.default)(res, {
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
exports.refresh = (0, catchAsync_1.default)(async (req, res) => {
    const refreshToken = req.body.refreshToken || req.cookies?.jwt;
    if (!refreshToken) {
        throw new AppError_1.AppError(400, 'Refresh token is required');
    }
    const result = await auth_service_1.authService.refresh(refreshToken);
    setRefreshTokenCookie(res, result.refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Token refreshed successfully',
        data: {
            accessToken: result.accessToken,
        },
    });
});
exports.logout = (0, catchAsync_1.default)(async (_req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: env_1.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Logged out successfully',
    });
});
exports.forgotPassword = (0, catchAsync_1.default)(async (req, res) => {
    const resetToken = await auth_service_1.authService.forgotPassword(req.body.email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Password reset token generated successfully. In production, this token would be sent to your email.',
        data: { resetToken },
    });
});
exports.resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const { token, newPassword } = req.body;
    await auth_service_1.authService.resetPassword(token, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Password has been reset successfully',
    });
});
exports.changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { oldPassword, newPassword } = req.body;
    await auth_service_1.authService.changePassword(currentUserId, oldPassword, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Password updated successfully',
    });
});

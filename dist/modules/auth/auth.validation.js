"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidationSchema = exports.forgotPasswordValidationSchema = exports.changePasswordValidationSchema = exports.refreshTokenValidationSchema = exports.loginValidationSchema = exports.registerValidationSchema = void 0;
const zod_1 = require("zod");
exports.registerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }).max(50),
        email: zod_1.z.string({ required_error: 'Email is required' }).email('Invalid email address'),
        password: zod_1.z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters'),
        role: zod_1.z.enum(['Organizer', 'Team Manager', 'Coach', 'Player', 'Referee', 'Scorekeeper', 'Spectator']).default('Spectator'),
        phoneNumber: zod_1.z.string().optional(),
        avatar: zod_1.z.string().optional(),
    }),
});
exports.loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }).email('Invalid email address'),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
exports.refreshTokenValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string({ required_error: 'Refresh token is required' }),
    }),
});
exports.changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({ required_error: 'Old password is required' }),
        newPassword: zod_1.z.string({ required_error: 'New password is required' }).min(8, 'New password must be at least 8 characters'),
    }),
});
exports.forgotPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    }),
});
exports.resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string({ required_error: 'Reset token is required' }),
        newPassword: zod_1.z.string({ required_error: 'New password is required' }).min(8, 'New password must be at least 8 characters'),
    }),
});

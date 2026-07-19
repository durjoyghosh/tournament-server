"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userParamsValidationSchema = exports.queryUserValidationSchema = exports.updateUserValidationSchema = exports.createUserValidationSchema = void 0;
const zod_1 = require("zod");
exports.createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }).max(50, 'Name must not exceed 50 characters'),
        email: zod_1.z.string({ required_error: 'Email is required' }).email('Invalid email address'),
        password: zod_1.z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters'),
        role: zod_1.z.enum(['Super Admin', 'Organizer', 'Team Manager', 'Coach', 'Player', 'Referee', 'Scorekeeper', 'Spectator']).optional(),
        phoneNumber: zod_1.z.string().optional(),
        avatar: zod_1.z.string().optional(),
    }),
});
exports.updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().max(50, 'Name must not exceed 50 characters').optional(),
        email: zod_1.z.string().email('Invalid email address').optional(),
        phoneNumber: zod_1.z.string().optional(),
        avatar: zod_1.z.string().optional(),
        role: zod_1.z.enum(['Super Admin', 'Organizer', 'Team Manager', 'Coach', 'Player', 'Referee', 'Scorekeeper', 'Spectator']).optional(),
        status: zod_1.z.enum(['active', 'inactive']).optional(),
    }),
});
exports.queryUserValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().positive().optional(),
        limit: zod_1.z.coerce.number().int().positive().optional(),
        sort: zod_1.z.string().optional(),
        order: zod_1.z.enum(['asc', 'desc']).optional(),
        search: zod_1.z.string().optional(),
        role: zod_1.z.string().optional(),
        status: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.enum(['active', 'inactive']).optional()),
        showDeleted: zod_1.z.string().optional(),
    }),
});
exports.userParamsValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    }),
});

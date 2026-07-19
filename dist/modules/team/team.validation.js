"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamParamsValidationSchema = exports.queryTeamValidationSchema = exports.updateTeamValidationSchema = exports.createTeamValidationSchema = void 0;
const zod_1 = require("zod");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
exports.createTeamValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Team name is required' }).trim().max(50),
        manager: zod_1.z.string({ required_error: 'Manager user ID is required' }).regex(objectIdRegex, 'Invalid Manager ID'),
        coach: zod_1.z.preprocess((val) => (val === '' ? null : val), zod_1.z.string().regex(objectIdRegex, 'Invalid Coach ID').nullable().optional()),
        logo: zod_1.z.string().optional(),
        city: zod_1.z.string().trim().optional(),
        country: zod_1.z.string().trim().optional(),
        founded: zod_1.z.preprocess((val) => (val === '' || val === null ? undefined : val), zod_1.z.coerce.number().int().optional()),
    }),
});
exports.updateTeamValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().max(50).optional(),
        manager: zod_1.z.string().regex(objectIdRegex, 'Invalid Manager ID').optional(),
        coach: zod_1.z.preprocess((val) => (val === '' ? null : val), zod_1.z.string().regex(objectIdRegex, 'Invalid Coach ID').nullable().optional()),
        logo: zod_1.z.string().optional(),
        city: zod_1.z.string().trim().optional(),
        country: zod_1.z.string().trim().optional(),
        founded: zod_1.z.preprocess((val) => (val === '' || val === null ? undefined : val), zod_1.z.coerce.number().int().optional()),
        status: zod_1.z.enum(['active', 'inactive']).optional(),
    }),
});
exports.queryTeamValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().positive().optional(),
        limit: zod_1.z.coerce.number().int().positive().optional(),
        sort: zod_1.z.string().optional(),
        order: zod_1.z.enum(['asc', 'desc']).optional(),
        search: zod_1.z.string().optional(),
        manager: zod_1.z.string().regex(objectIdRegex, 'Invalid Manager ID').optional(),
        coach: zod_1.z.string().regex(objectIdRegex, 'Invalid Coach ID').optional(),
        status: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.enum(['active', 'inactive']).optional()),
        showDeleted: zod_1.z.string().optional(),
    }),
});
exports.teamParamsValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(objectIdRegex, 'Invalid Team ID'),
    }),
});

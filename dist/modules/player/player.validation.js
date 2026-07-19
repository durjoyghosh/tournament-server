"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerParamsValidationSchema = exports.queryPlayerValidationSchema = exports.updatePlayerValidationSchema = exports.createPlayerValidationSchema = void 0;
const zod_1 = require("zod");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
exports.createPlayerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.string({ required_error: 'User ID is required' }).regex(objectIdRegex, 'Invalid User ID'),
        team: zod_1.z.preprocess((val) => (val === '' ? null : val), zod_1.z.string().regex(objectIdRegex, 'Invalid Team ID').nullable().optional()),
        position: zod_1.z.string().trim().optional(),
        jerseyNumber: zod_1.z.preprocess((val) => (val === '' || val === null ? undefined : val), zod_1.z.coerce.number().int().nonnegative().optional()),
        bio: zod_1.z.string().trim().optional(),
        nationality: zod_1.z.string().trim().optional(),
        age: zod_1.z.preprocess((val) => (val === '' || val === null ? undefined : val), zod_1.z.coerce.number().int().nonnegative().optional()),
        height: zod_1.z.string().trim().optional(),
    }),
});
exports.updatePlayerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        team: zod_1.z.preprocess((val) => (val === '' ? null : val), zod_1.z.string().regex(objectIdRegex, 'Invalid Team ID').nullable().optional()),
        position: zod_1.z.string().trim().optional(),
        jerseyNumber: zod_1.z.preprocess((val) => (val === '' || val === null ? undefined : val), zod_1.z.coerce.number().int().nonnegative().optional()),
        bio: zod_1.z.string().trim().optional(),
        nationality: zod_1.z.string().trim().optional(),
        age: zod_1.z.preprocess((val) => (val === '' || val === null ? undefined : val), zod_1.z.coerce.number().int().nonnegative().optional()),
        height: zod_1.z.string().trim().optional(),
        status: zod_1.z.enum(['active', 'inactive']).optional(),
        stats: zod_1.z.object({
            matchesPlayed: zod_1.z.number().int().nonnegative().optional(),
            goals: zod_1.z.number().int().nonnegative().optional(),
            assists: zod_1.z.number().int().nonnegative().optional(),
            yellowCards: zod_1.z.number().int().nonnegative().optional(),
            redCards: zod_1.z.number().int().nonnegative().optional(),
        }).optional(),
    }),
});
exports.queryPlayerValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().positive().optional(),
        limit: zod_1.z.coerce.number().int().positive().optional(),
        sort: zod_1.z.string().optional(),
        order: zod_1.z.enum(['asc', 'desc']).optional(),
        team: zod_1.z.string().regex(objectIdRegex, 'Invalid Team ID').optional(),
        status: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.enum(['active', 'inactive']).optional()),
        search: zod_1.z.string().optional(),
        showDeleted: zod_1.z.string().optional(),
    }),
});
exports.playerParamsValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(objectIdRegex, 'Invalid Player ID'),
    }),
});

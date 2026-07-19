"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkMatchValidationSchema = exports.matchParamsValidationSchema = exports.queryMatchValidationSchema = exports.refereeReportValidationSchema = exports.refereeStatusValidationSchema = exports.lineupValidationSchema = exports.matchEventValidationSchema = exports.updateScoreValidationSchema = exports.updateMatchValidationSchema = exports.createMatchValidationSchema = void 0;
const zod_1 = require("zod");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const createRequiredDateSchema = (fieldName) => zod_1.z.string({ required_error: `${fieldName} is required` })
    .trim()
    .min(1, `${fieldName} is required`)
    .refine((val) => !isNaN(Date.parse(val)), { message: `Invalid ${fieldName.toLowerCase()} format` })
    .transform((val) => new Date(val).toISOString());
const createOptionalDateSchema = (fieldName) => zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string()
    .refine((val) => !isNaN(Date.parse(val)), { message: `Invalid ${fieldName.toLowerCase()} format` })
    .transform((val) => new Date(val).toISOString())
    .optional());
exports.createMatchValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        tournament: zod_1.z.string({ required_error: 'Tournament ID is required' }).regex(objectIdRegex, 'Invalid Tournament ID'),
        homeTeam: zod_1.z.string({ required_error: 'Home Team ID is required' }).regex(objectIdRegex, 'Invalid Home Team ID'),
        awayTeam: zod_1.z.string({ required_error: 'Away Team ID is required' }).regex(objectIdRegex, 'Invalid Away Team ID'),
        venue: zod_1.z.string().trim().optional(),
        referee: zod_1.z.preprocess((val) => (val === '' ? null : val), zod_1.z.string().regex(objectIdRegex, 'Invalid Referee ID').nullable().optional()),
        scorekeeper: zod_1.z.preprocess((val) => (val === '' ? null : val), zod_1.z.string().regex(objectIdRegex, 'Invalid Scorekeeper ID').nullable().optional()),
        date: createRequiredDateSchema('Match date'),
        round: zod_1.z.string().optional(),
    }),
});
exports.updateMatchValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        venue: zod_1.z.string().trim().optional(),
        referee: zod_1.z.preprocess((val) => (val === '' ? null : val), zod_1.z.string().regex(objectIdRegex, 'Invalid Referee ID').nullable().optional()),
        scorekeeper: zod_1.z.preprocess((val) => (val === '' ? null : val), zod_1.z.string().regex(objectIdRegex, 'Invalid Scorekeeper ID').nullable().optional()),
        date: createOptionalDateSchema('Match date'),
        round: zod_1.z.string().optional(),
        status: zod_1.z.enum(['scheduled', 'live', 'halftime', 'completed', 'cancelled']).optional(),
        score: zod_1.z.object({
            homeTeam: zod_1.z.number().int().nonnegative().optional(),
            awayTeam: zod_1.z.number().int().nonnegative().optional(),
        }).optional(),
    }),
});
// All possible event types across all sports
const matchEventTypeEnum = zod_1.z.enum([
    'goal', 'assist', 'yellow_card', 'red_card', 'substitution', 'timeout',
    'period_start', 'period_end', 'corner', 'penalty', 'foul',
    'run', 'wicket', 'over', 'extra',
    'point', 'set_win', 'set_timeout',
    'rebound', 'custom',
]);
exports.updateScoreValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        score: zod_1.z.object({
            homeTeam: zod_1.z.number().int().nonnegative(),
            awayTeam: zod_1.z.number().int().nonnegative(),
        }),
        event: zod_1.z.object({
            type: matchEventTypeEnum,
            minute: zod_1.z.number().int().nonnegative(),
            team: zod_1.z.enum(['home', 'away']).optional(),
            player: zod_1.z.string().regex(objectIdRegex, 'Invalid Player ID').optional(),
            details: zod_1.z.string().trim().optional(),
        }).optional(),
        minute: zod_1.z.number().int().nonnegative().optional(),
    }),
});
exports.matchEventValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        event: zod_1.z.object({
            type: matchEventTypeEnum,
            minute: zod_1.z.number().int().nonnegative(),
            team: zod_1.z.enum(['home', 'away']).optional(),
            player: zod_1.z.string().regex(objectIdRegex, 'Invalid Player ID').optional(),
            details: zod_1.z.string().trim().optional(),
        }),
        score: zod_1.z.object({
            homeTeam: zod_1.z.number().int().nonnegative(),
            awayTeam: zod_1.z.number().int().nonnegative(),
        }).optional(),
        minute: zod_1.z.number().int().nonnegative().optional(),
    }),
});
exports.lineupValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        side: zod_1.z.enum(['home', 'away']),
        starting: zod_1.z.array(zod_1.z.string().regex(objectIdRegex, 'Invalid Player ID')).max(11),
        substitutes: zod_1.z.array(zod_1.z.string().regex(objectIdRegex, 'Invalid Player ID')).max(7),
    }),
});
exports.refereeStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['accepted', 'rejected']),
        reason: zod_1.z.string().optional(),
    }),
});
exports.refereeReportValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        report: zod_1.z.string({ required_error: 'Report content is required' }).min(20, 'Report must be at least 20 characters'),
    }),
});
exports.queryMatchValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().positive().optional(),
        limit: zod_1.z.coerce.number().int().positive().optional(),
        sort: zod_1.z.string().optional(),
        order: zod_1.z.enum(['asc', 'desc']).optional(),
        tournament: zod_1.z.string().regex(objectIdRegex, 'Invalid Tournament ID').optional(),
        team: zod_1.z.string().regex(objectIdRegex, 'Invalid Team ID').optional(),
        referee: zod_1.z.string().regex(objectIdRegex, 'Invalid Referee ID').optional(),
        scorekeeper: zod_1.z.string().regex(objectIdRegex, 'Invalid Scorekeeper ID').optional(),
        status: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.enum(['scheduled', 'live', 'halftime', 'completed', 'cancelled']).optional()),
        showDeleted: zod_1.z.string().optional(),
    }),
});
exports.matchParamsValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(objectIdRegex, 'Invalid Match ID'),
    }),
});
exports.bulkMatchValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        ids: zod_1.z.array(zod_1.z.string().regex(objectIdRegex, 'Invalid Match ID')).min(1, 'At least one ID is required'),
    }),
});

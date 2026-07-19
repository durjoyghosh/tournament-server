"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixtureGeneratorValidationSchema = exports.sponsorValidationSchema = exports.announcementValidationSchema = exports.tournamentParamsValidationSchema = exports.registerTeamValidationSchema = exports.queryTournamentValidationSchema = exports.updateTournamentValidationSchema = exports.createTournamentValidationSchema = exports.updateSportValidationSchema = exports.createSportValidationSchema = void 0;
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
exports.createSportValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Sport name is required' }).trim(),
        type: zod_1.z.enum(['team', 'individual']).default('team'),
        rules: zod_1.z.string().optional(),
    }),
});
exports.updateSportValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().optional(),
        type: zod_1.z.enum(['team', 'individual']).optional(),
        rules: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'inactive']).optional(),
    }),
});
exports.createTournamentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Tournament name is required' }).trim().max(100),
        sport: zod_1.z.string({ required_error: 'Sport ID is required' }).regex(objectIdRegex, 'Invalid Sport ID'),
        season: zod_1.z.string({ required_error: 'Season is required' }).trim(),
        description: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        startDate: createRequiredDateSchema('Start date'),
        endDate: createRequiredDateSchema('End date'),
        format: zod_1.z.enum(['knockout', 'league', 'hybrid']),
        maxTeams: zod_1.z.number().int().min(2).optional(),
        prizePool: zod_1.z.number().min(0).optional(),
        organizer: zod_1.z.string().regex(objectIdRegex, 'Invalid Organizer ID').optional(),
        banner: zod_1.z.string().optional(),
        rulesUrl: zod_1.z.string().optional(),
    }).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
        message: 'End date must be after start date',
        path: ['endDate'],
    }),
});
exports.updateTournamentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().max(100).optional(),
        sport: zod_1.z.string().regex(objectIdRegex, 'Invalid Sport ID').optional(),
        season: zod_1.z.string().trim().optional(),
        description: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        startDate: createOptionalDateSchema('Start date'),
        endDate: createOptionalDateSchema('End date'),
        format: zod_1.z.enum(['knockout', 'league', 'hybrid']).optional(),
        status: zod_1.z.enum(['upcoming', 'live', 'completed', 'cancelled']).optional(),
        maxTeams: zod_1.z.number().int().min(2).optional(),
        prizePool: zod_1.z.number().min(0).optional(),
        banner: zod_1.z.string().optional(),
        rulesUrl: zod_1.z.string().optional(),
    }),
});
exports.queryTournamentValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().positive().optional(),
        limit: zod_1.z.coerce.number().int().positive().optional(),
        sort: zod_1.z.string().optional(),
        order: zod_1.z.enum(['asc', 'desc']).optional(),
        search: zod_1.z.string().optional(),
        sport: zod_1.z.string().regex(objectIdRegex, 'Invalid Sport ID').optional(),
        status: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.enum(['upcoming', 'live', 'completed', 'cancelled']).optional()),
        organizer: zod_1.z.string().regex(objectIdRegex, 'Invalid Organizer ID').optional(),
        isPublished: zod_1.z.string().optional(),
        showDeleted: zod_1.z.string().optional(),
    }),
});
exports.registerTeamValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        teamId: zod_1.z.string({ required_error: 'Team ID is required' }).regex(objectIdRegex, 'Invalid Team ID'),
    }),
});
exports.tournamentParamsValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(objectIdRegex, 'Invalid Tournament ID'),
    }),
});
exports.announcementValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Announcement title is required' }).trim(),
        content: zod_1.z.string({ required_error: 'Announcement content is required' }).trim(),
    }),
});
exports.sponsorValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Sponsor name is required' }).trim(),
        logo: zod_1.z.string().optional(),
        tier: zod_1.z.enum(['platinum', 'gold', 'silver', 'bronze']).default('bronze'),
        website: zod_1.z.string().optional(),
    }),
});
exports.fixtureGeneratorValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        startDate: createRequiredDateSchema('Start date'),
        venue: zod_1.z.string().optional(),
        matchIntervalDays: zod_1.z.number().int().min(1).default(3),
    }),
});

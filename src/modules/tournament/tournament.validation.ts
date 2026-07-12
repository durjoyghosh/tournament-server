import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createSportValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Sport name is required' }).trim(),
    type: z.enum(['team', 'individual']).default('team'),
    rules: z.string().optional(),
  }),
});

export const updateSportValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().optional(),
    type: z.enum(['team', 'individual']).optional(),
    rules: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const createTournamentValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Tournament name is required' }).trim().max(100),
    sport: z.string({ required_error: 'Sport ID is required' }).regex(objectIdRegex, 'Invalid Sport ID'),
    season: z.string({ required_error: 'Season is required' }).trim(),
    description: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string({ required_error: 'Start date is required' }).datetime('Invalid start date format'),
    endDate: z.string({ required_error: 'End date is required' }).datetime('Invalid end date format'),
    format: z.enum(['knockout', 'league', 'hybrid']),
    maxTeams: z.number().int().min(2).optional(),
    prizePool: z.number().min(0).optional(),
    organizer: z.string().regex(objectIdRegex, 'Invalid Organizer ID').optional(),
    banner: z.string().optional(),
    rulesUrl: z.string().optional(),
  }).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  }),
});

export const updateTournamentValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().max(100).optional(),
    sport: z.string().regex(objectIdRegex, 'Invalid Sport ID').optional(),
    season: z.string().trim().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().datetime('Invalid start date format').optional(),
    endDate: z.string().datetime('Invalid end date format').optional(),
    format: z.enum(['knockout', 'league', 'hybrid']).optional(),
    status: z.enum(['upcoming', 'live', 'completed', 'cancelled']).optional(),
    maxTeams: z.number().int().min(2).optional(),
    prizePool: z.number().min(0).optional(),
    banner: z.string().optional(),
    rulesUrl: z.string().optional(),
  }),
});

export const queryTournamentValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional(),
    search: z.string().optional(),
    sport: z.string().regex(objectIdRegex, 'Invalid Sport ID').optional(),
    status: z.enum(['upcoming', 'live', 'completed', 'cancelled']).optional(),
    organizer: z.string().regex(objectIdRegex, 'Invalid Organizer ID').optional(),
    isPublished: z.string().optional(),
  }),
});

export const registerTeamValidationSchema = z.object({
  body: z.object({
    teamId: z.string({ required_error: 'Team ID is required' }).regex(objectIdRegex, 'Invalid Team ID'),
  }),
});

export const tournamentParamsValidationSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid Tournament ID'),
  }),
});

export const announcementValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Announcement title is required' }).trim(),
    content: z.string({ required_error: 'Announcement content is required' }).trim(),
  }),
});

export const sponsorValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Sponsor name is required' }).trim(),
    logo: z.string().optional(),
    tier: z.enum(['platinum', 'gold', 'silver', 'bronze']).default('bronze'),
    website: z.string().optional(),
  }),
});

export const fixtureGeneratorValidationSchema = z.object({
  body: z.object({
    startDate: z.string({ required_error: 'Start date is required' }).datetime('Invalid start date'),
    venue: z.string().optional(),
    matchIntervalDays: z.number().int().min(1).default(3),
  }),
});

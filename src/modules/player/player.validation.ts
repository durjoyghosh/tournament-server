import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createPlayerValidationSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'User ID is required' }).regex(objectIdRegex, 'Invalid User ID'),
    team: z.string().regex(objectIdRegex, 'Invalid Team ID').optional(),
    position: z.string().trim().optional(),
    jerseyNumber: z.number().int().nonnegative().optional(),
    bio: z.string().trim().optional(),
  }),
});

export const updatePlayerValidationSchema = z.object({
  body: z.object({
    team: z.string().regex(objectIdRegex, 'Invalid Team ID').optional(),
    position: z.string().trim().optional(),
    jerseyNumber: z.number().int().nonnegative().optional(),
    bio: z.string().trim().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    stats: z.object({
      matchesPlayed: z.number().int().nonnegative().optional(),
      goals: z.number().int().nonnegative().optional(),
      assists: z.number().int().nonnegative().optional(),
      yellowCards: z.number().int().nonnegative().optional(),
      redCards: z.number().int().nonnegative().optional(),
    }).optional(),
  }),
});

export const queryPlayerValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional(),
    team: z.string().regex(objectIdRegex, 'Invalid Team ID').optional(),
    status: z.enum(['active', 'inactive']).optional(),
    search: z.string().optional(),
  }),
});

export const playerParamsValidationSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid Player ID'),
  }),
});

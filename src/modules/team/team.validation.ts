import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createTeamValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Team name is required' }).trim().max(50),
    manager: z.string({ required_error: 'Manager user ID is required' }).regex(objectIdRegex, 'Invalid Manager ID'),
    coach: z.string().regex(objectIdRegex, 'Invalid Coach ID').optional(),
    logo: z.string().optional(),
  }),
});

export const updateTeamValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().max(50).optional(),
    manager: z.string().regex(objectIdRegex, 'Invalid Manager ID').optional(),
    coach: z.string().regex(objectIdRegex, 'Invalid Coach ID').optional(),
    logo: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const queryTeamValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional(),
    search: z.string().optional(),
    manager: z.string().regex(objectIdRegex, 'Invalid Manager ID').optional(),
    coach: z.string().regex(objectIdRegex, 'Invalid Coach ID').optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const teamParamsValidationSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid Team ID'),
  }),
});

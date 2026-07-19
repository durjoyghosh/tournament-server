import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createTeamValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Team name is required' }).trim().max(50),
    manager: z.string({ required_error: 'Manager user ID is required' }).regex(objectIdRegex, 'Invalid Manager ID'),
    coach: z.preprocess((val) => (val === '' ? null : val), z.string().regex(objectIdRegex, 'Invalid Coach ID').nullable().optional()),
    logo: z.string().optional(),
    city: z.string().trim().optional(),
    country: z.string().trim().optional(),
    founded: z.preprocess((val) => (val === '' || val === null ? undefined : val), z.coerce.number().int().optional()),
  }),
});

export const updateTeamValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().max(50).optional(),
    manager: z.string().regex(objectIdRegex, 'Invalid Manager ID').optional(),
    coach: z.preprocess((val) => (val === '' ? null : val), z.string().regex(objectIdRegex, 'Invalid Coach ID').nullable().optional()),
    logo: z.string().optional(),
    city: z.string().trim().optional(),
    country: z.string().trim().optional(),
    founded: z.preprocess((val) => (val === '' || val === null ? undefined : val), z.coerce.number().int().optional()),
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
    status: z.preprocess((val) => (val === '' ? undefined : val), z.enum(['active', 'inactive']).optional()),
    showDeleted: z.string().optional(),
  }),
});

export const teamParamsValidationSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid Team ID'),
  }),
});

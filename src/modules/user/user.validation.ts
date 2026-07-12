import { z } from 'zod';

export const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).max(50, 'Name must not exceed 50 characters'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters'),
    role: z.enum(['Super Admin', 'Organizer', 'Team Manager', 'Coach', 'Player', 'Referee', 'Scorekeeper', 'Spectator']).optional(),
    phoneNumber: z.string().optional(),
    avatar: z.string().optional(),
  }),
});

export const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().max(50, 'Name must not exceed 50 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    phoneNumber: z.string().optional(),
    avatar: z.string().optional(),
    role: z.enum(['Super Admin', 'Organizer', 'Team Manager', 'Coach', 'Player', 'Referee', 'Scorekeeper', 'Spectator']).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const queryUserValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional(),
    search: z.string().optional(),
    role: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const userParamsValidationSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
});

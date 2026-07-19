import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createRequiredDateSchema = (fieldName: string) =>
  z.string({ required_error: `${fieldName} is required` })
    .trim()
    .min(1, `${fieldName} is required`)
    .refine((val) => !isNaN(Date.parse(val)), { message: `Invalid ${fieldName.toLowerCase()} format` })
    .transform((val) => new Date(val).toISOString());

const createOptionalDateSchema = (fieldName: string) =>
  z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string()
      .refine((val) => !isNaN(Date.parse(val)), { message: `Invalid ${fieldName.toLowerCase()} format` })
      .transform((val) => new Date(val).toISOString())
      .optional()
  );

export const createMatchValidationSchema = z.object({
  body: z.object({
    tournament: z.string({ required_error: 'Tournament ID is required' }).regex(objectIdRegex, 'Invalid Tournament ID'),
    homeTeam: z.string({ required_error: 'Home Team ID is required' }).regex(objectIdRegex, 'Invalid Home Team ID'),
    awayTeam: z.string({ required_error: 'Away Team ID is required' }).regex(objectIdRegex, 'Invalid Away Team ID'),
    venue: z.string().trim().optional(),
    referee: z.preprocess((val) => (val === '' ? null : val), z.string().regex(objectIdRegex, 'Invalid Referee ID').nullable().optional()),
    scorekeeper: z.preprocess((val) => (val === '' ? null : val), z.string().regex(objectIdRegex, 'Invalid Scorekeeper ID').nullable().optional()),
    date: createRequiredDateSchema('Match date'),
    round: z.string().optional(),
  }),
});

export const updateMatchValidationSchema = z.object({
  body: z.object({
    venue: z.string().trim().optional(),
    referee: z.preprocess((val) => (val === '' ? null : val), z.string().regex(objectIdRegex, 'Invalid Referee ID').nullable().optional()),
    scorekeeper: z.preprocess((val) => (val === '' ? null : val), z.string().regex(objectIdRegex, 'Invalid Scorekeeper ID').nullable().optional()),
    date: createOptionalDateSchema('Match date'),
    round: z.string().optional(),
    status: z.enum(['scheduled', 'live', 'halftime', 'completed', 'cancelled']).optional(),
    score: z.object({
      homeTeam: z.number().int().nonnegative().optional(),
      awayTeam: z.number().int().nonnegative().optional(),
    }).optional(),
  }),
});

// All possible event types across all sports
const matchEventTypeEnum = z.enum([
  'goal', 'assist', 'yellow_card', 'red_card', 'substitution', 'timeout',
  'period_start', 'period_end', 'corner', 'penalty', 'foul',
  'run', 'wicket', 'over', 'extra',
  'point', 'set_win', 'set_timeout',
  'rebound', 'custom',
]);

export const updateScoreValidationSchema = z.object({
  body: z.object({
    score: z.object({
      homeTeam: z.number().int().nonnegative(),
      awayTeam: z.number().int().nonnegative(),
    }),
    event: z.object({
      type: matchEventTypeEnum,
      minute: z.number().int().nonnegative(),
      team: z.enum(['home', 'away']).optional(),
      player: z.string().regex(objectIdRegex, 'Invalid Player ID').optional(),
      details: z.string().trim().optional(),
    }).optional(),
    minute: z.number().int().nonnegative().optional(),
  }),
});

export const matchEventValidationSchema = z.object({
  body: z.object({
    event: z.object({
      type: matchEventTypeEnum,
      minute: z.number().int().nonnegative(),
      team: z.enum(['home', 'away']).optional(),
      player: z.string().regex(objectIdRegex, 'Invalid Player ID').optional(),
      details: z.string().trim().optional(),
    }),
    score: z.object({
      homeTeam: z.number().int().nonnegative(),
      awayTeam: z.number().int().nonnegative(),
    }).optional(),
    minute: z.number().int().nonnegative().optional(),
  }),
});

export const lineupValidationSchema = z.object({
  body: z.object({
    side: z.enum(['home', 'away']),
    starting: z.array(z.string().regex(objectIdRegex, 'Invalid Player ID')).max(11),
    substitutes: z.array(z.string().regex(objectIdRegex, 'Invalid Player ID')).max(7),
  }),
});

export const refereeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['accepted', 'rejected']),
    reason: z.string().optional(),
  }),
});

export const refereeReportValidationSchema = z.object({
  body: z.object({
    report: z.string({ required_error: 'Report content is required' }).min(20, 'Report must be at least 20 characters'),
  }),
});

export const queryMatchValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional(),
    tournament: z.string().regex(objectIdRegex, 'Invalid Tournament ID').optional(),
    team: z.string().regex(objectIdRegex, 'Invalid Team ID').optional(),
    referee: z.string().regex(objectIdRegex, 'Invalid Referee ID').optional(),
    scorekeeper: z.string().regex(objectIdRegex, 'Invalid Scorekeeper ID').optional(),
    status: z.preprocess((val) => (val === '' ? undefined : val), z.enum(['scheduled', 'live', 'halftime', 'completed', 'cancelled']).optional()),
    showDeleted: z.string().optional(),
  }),
});

export const matchParamsValidationSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid Match ID'),
  }),
});

export const bulkMatchValidationSchema = z.object({
  body: z.object({
    ids: z.array(z.string().regex(objectIdRegex, 'Invalid Match ID')).min(1, 'At least one ID is required'),
  }),
});


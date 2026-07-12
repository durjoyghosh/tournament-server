import { Schema, model, Document, Types } from 'mongoose';

export interface IMatchScore {
  homeTeam: number;
  awayTeam: number;
}

export interface IMatchEvent {
  type: 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'substitution' | 'timeout'
    | 'period_start' | 'period_end' | 'corner' | 'penalty' | 'foul'
    | 'run' | 'wicket' | 'over' | 'extra'      // Cricket
    | 'point' | 'set_win' | 'set_timeout'        // Volleyball / Basketball
    | 'rebound' | 'custom';
  minute: number;
  team?: 'home' | 'away';
  player?: Types.ObjectId | string;
  details?: string;
}

export interface ILineupSide {
  starting: (Types.ObjectId | string)[];
  substitutes: (Types.ObjectId | string)[];
}

export interface ILineups {
  home: ILineupSide;
  away: ILineupSide;
}

export interface IMatch extends Document {
  tournament: Types.ObjectId | string;
  homeTeam: Types.ObjectId | string;
  awayTeam: Types.ObjectId | string;
  venue?: string;
  referee?: Types.ObjectId | string;
  scorekeeper?: Types.ObjectId | string;
  date: Date;
  round?: string;
  status: 'scheduled' | 'live' | 'halftime' | 'completed' | 'cancelled';
  refereeStatus: 'pending' | 'accepted' | 'rejected';
  refereeReport: string;
  score: IMatchScore;
  events: IMatchEvent[];
  lineups: ILineups;
  minute?: number;
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const scoreSchema = new Schema<IMatchScore>(
  {
    homeTeam: { type: Number, default: 0 },
    awayTeam: { type: Number, default: 0 },
  },
  { _id: false }
);

const eventSchema = new Schema<IMatchEvent>(
  {
    type: {
      type: String,
      enum: [
        'goal', 'assist', 'yellow_card', 'red_card', 'substitution', 'timeout',
        'period_start', 'period_end', 'corner', 'penalty', 'foul',
        'run', 'wicket', 'over', 'extra',
        'point', 'set_win', 'set_timeout',
        'rebound', 'custom',
      ],
      required: true,
    },
    minute: { type: Number, required: true },
    team: { type: String, enum: ['home', 'away'] },
    player: { type: Schema.Types.ObjectId, ref: 'Player' },
    details: { type: String, trim: true },
  },
  { _id: true }
);

const lineupSideSchema = new Schema<ILineupSide>(
  {
    starting: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    substitutes: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  },
  { _id: false }
);

const lineupSchema = new Schema<ILineups>(
  {
    home: { type: lineupSideSchema, default: () => ({ starting: [], substitutes: [] }) },
    away: { type: lineupSideSchema, default: () => ({ starting: [], substitutes: [] }) },
  },
  { _id: false }
);

const matchSchema = new Schema<IMatch>(
  {
    tournament: {
      type: Schema.Types.ObjectId,
      ref: 'Tournament',
      required: [true, 'Please provide the tournament reference'],
    },
    homeTeam: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Please provide the home team reference'],
    },
    awayTeam: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Please provide the away team reference'],
    },
    venue: {
      type: String,
      trim: true,
    },
    referee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    scorekeeper: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    date: {
      type: Date,
      required: [true, 'Please provide the match date'],
    },
    round: {
      type: String,
      trim: true,
      default: 'Group Stage',
    },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'halftime', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    refereeStatus: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    refereeReport: {
      type: String,
      default: '',
    },
    score: {
      type: scoreSchema,
      default: () => ({ homeTeam: 0, awayTeam: 0 }),
    },
    events: {
      type: [eventSchema],
      default: [],
    },
    lineups: {
      type: lineupSchema,
      default: () => ({
        home: { starting: [], substitutes: [] },
        away: { starting: [], substitutes: [] },
      }),
    },
    minute: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

matchSchema.index({ isDeleted: 1, status: 1 });
matchSchema.index({ tournament: 1 });
matchSchema.index({ homeTeam: 1, awayTeam: 1 });
matchSchema.index({ referee: 1, refereeStatus: 1 });
matchSchema.index({ scorekeeper: 1 });

export const Match = model<IMatch>('Match', matchSchema);
export default Match;

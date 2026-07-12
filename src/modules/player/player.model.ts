import { Schema, model, Document, Types } from 'mongoose';

export interface IPlayerStats {
  matchesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  // Basketball/Volleyball
  points: number;
  rebounds: number;
  fouls: number;
  // Cricket
  runs: number;
  wickets: number;
}

export interface IDisciplinaryRecord {
  match?: Types.ObjectId | string;
  card: 'yellow' | 'red';
  reason?: string;
  date: Date;
}

export interface IPlayer extends Document {
  user: Types.ObjectId | string;
  team?: Types.ObjectId | string;
  position?: string;
  jerseyNumber?: number;
  bio?: string;
  nationality?: string;
  age?: number;
  height?: string;
  stats: IPlayerStats;
  isInjured: boolean;
  isAvailable: boolean;
  achievements: string[];
  disciplinaryHistory: IDisciplinaryRecord[];
  status: 'active' | 'inactive';
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const statsSchema = new Schema<IPlayerStats>(
  {
    matchesPlayed: { type: Number, default: 0 },
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    yellowCards: { type: Number, default: 0 },
    redCards: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    rebounds: { type: Number, default: 0 },
    fouls: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
  },
  { _id: false }
);

const disciplinarySchema = new Schema<IDisciplinaryRecord>(
  {
    match: { type: Schema.Types.ObjectId, ref: 'Match' },
    card: { type: String, enum: ['yellow', 'red'], required: true },
    reason: { type: String, trim: true, default: '' },
    date: { type: Date, default: Date.now },
  },
  { _id: true }
);

const playerSchema = new Schema<IPlayer>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the user reference for the player'],
      unique: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },
    position: {
      type: String,
      trim: true,
    },
    jerseyNumber: {
      type: Number,
      min: [0, 'Jersey number cannot be negative'],
    },
    bio: {
      type: String,
      trim: true,
    },
    nationality: {
      type: String,
      trim: true,
      default: '',
    },
    age: {
      type: Number,
    },
    height: {
      type: String,
      trim: true,
      default: '',
    },
    stats: {
      type: statsSchema,
      default: () => ({}),
    },
    isInjured: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    achievements: {
      type: [String],
      default: [],
    },
    disciplinaryHistory: {
      type: [disciplinarySchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
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

playerSchema.index({ isDeleted: 1, status: 1 });
playerSchema.index({ team: 1 });
playerSchema.index({ user: 1 });

export const Player = model<IPlayer>('Player', playerSchema);
export default Player;

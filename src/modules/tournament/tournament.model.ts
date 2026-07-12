import { Schema, model, Document, Types } from 'mongoose';

export interface ITournamentSponsor {
  name: string;
  logo?: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  website?: string;
}

export interface ITournamentAnnouncement {
  title: string;
  content: string;
  date: Date;
}

export interface ITournament extends Document {
  name: string;
  sport: Types.ObjectId | string;
  season: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  format: 'knockout' | 'league' | 'hybrid';
  teams: (Types.ObjectId | string)[];
  pendingTeams: (Types.ObjectId | string)[];
  rejectedTeams: (Types.ObjectId | string)[];
  maxTeams: number;
  prizePool: number;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  isPublished: boolean;
  organizer: Types.ObjectId | string;
  banner?: string;
  rulesUrl?: string;
  sponsors: ITournamentSponsor[];
  gallery: string[];
  announcements: ITournamentAnnouncement[];
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const sponsorSchema = new Schema<ITournamentSponsor>(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    tier: {
      type: String,
      enum: ['platinum', 'gold', 'silver', 'bronze'],
      default: 'bronze',
    },
    website: { type: String, default: '' },
  },
  { _id: true }
);

const announcementSchema = new Schema<ITournamentAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
  },
  { _id: true }
);

const tournamentSchema = new Schema<ITournament>(
  {
    name: {
      type: String,
      required: [true, 'Please provide the tournament name'],
      trim: true,
      maxlength: [100, 'Tournament name cannot exceed 100 characters'],
    },
    sport: {
      type: Schema.Types.ObjectId,
      ref: 'Sport',
      required: [true, 'Please provide the sport reference'],
    },
    season: {
      type: String,
      required: [true, 'Please provide the tournament season'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide the start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide the end date'],
    },
    format: {
      type: String,
      enum: ['knockout', 'league', 'hybrid'],
      required: [true, 'Please provide the format'],
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    pendingTeams: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    rejectedTeams: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    maxTeams: {
      type: Number,
      default: 16,
      min: [2, 'Tournament needs at least 2 teams'],
    },
    prizePool: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the organizer'],
    },
    banner: {
      type: String,
      default: '',
    },
    rulesUrl: {
      type: String,
      default: '',
    },
    sponsors: {
      type: [sponsorSchema],
      default: [],
    },
    gallery: {
      type: [String],
      default: [],
    },
    announcements: {
      type: [announcementSchema],
      default: [],
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

tournamentSchema.index({ isDeleted: 1, status: 1 });
tournamentSchema.index({ sport: 1 });
tournamentSchema.index({ organizer: 1 });
tournamentSchema.index({ isPublished: 1 });

export const Tournament = model<ITournament>('Tournament', tournamentSchema);
export default Tournament;

import { Schema, model, Document, Types } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  manager: Types.ObjectId | string;
  coach?: Types.ObjectId | string;
  captain?: Types.ObjectId | string;
  logo?: string;
  city?: string;
  country?: string;
  founded?: number;
  status: 'active' | 'inactive';
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, 'Please provide the team name'],
      trim: true,
      unique: true,
      maxlength: [50, 'Team name cannot exceed 50 characters'],
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the team manager reference'],
    },
    coach: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    captain: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    logo: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    country: {
      type: String,
      trim: true,
      default: '',
    },
    founded: {
      type: Number,
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

teamSchema.index({ isDeleted: 1, status: 1 });
teamSchema.index({ manager: 1 });
teamSchema.index({ coach: 1 });

export const Team = model<ITeam>('Team', teamSchema);
export default Team;
